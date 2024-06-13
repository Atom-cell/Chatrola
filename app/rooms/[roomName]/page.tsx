'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import Timer from '../../components/Timer';
import { getUsername, getSeconds, getMinutes, getToken, clearStorage } from '@/app/utils/LocalStorage';

export default function Home({ params }: { params: { roomName: string } }) {
	const router = useRouter();
	const name = getUsername();
	const token = getToken();

	const [socket, setSocket] = useState<Socket | null>();
	const [msgInput, setMsgInput] = useState('');
	const [message, setMessage] = useState<string[]>([]);
	const [startTimer, setStartTimer] = useState(false);
	const [minutes, setMinutes] = useState<number>();

	useEffect(() => {
		// get all messages for the room
	}, []);

	useEffect(() => {
		const secondsFromMemory = getSeconds();
		if (secondsFromMemory) {
			const minutes = parseInt(secondsFromMemory, 10) / 60;
			setMinutes(minutes);
		} else {
			const minutesString = getMinutes();
			const mins: number =
				minutesString !== null ? parseInt(minutesString, 10) : 0;
			setMinutes(mins);
		}

		const newSocket = io('http://localhost:5000');

		newSocket.on('connect', () => {
			console.log('Connected to server');
		}); 

		newSocket.emit('join-room', { roomName: params.roomName, token: token });

		newSocket.on('disconnect', () => {
			// clearStorage();
			console.log('Disconnected from server ');
		});

		newSocket.on('roomFull', () => {
			alert(`Room is full.`);
			router.push('/');
		});

		// newSocket.on('invalidToken', (response) => {
		// 	alert(response);
		// 	router.push('/');
		// });

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	// Receiving message
	useEffect(() => {
		if (socket) {
			const handleMessage = (socketMessage: string) => {
				console.log('message array ', message, ' socket ', socketMessage);
				setMessage((prevMessage) => [...prevMessage, socketMessage]);
			};

			socket.on('emitMessage', handleMessage);

			socket.on('invalidToken', (response) => {
				alert(response);
				router.push('/');
			});

			socket.on('start-timer', () => {
				console.log('Start timer');
				setStartTimer(true);
			});

			socket.on('stop-timer', () => {
				console.log('Stop Timer');
				setStartTimer(false);
			});

			return () => {
				socket.off('emitMessage', handleMessage);
			};
		}
	}, [socket, message]);

	const deleteMessages = async (): Promise<void> => {
		try {
			const deleteCall = await fetch('http://localhost:5000/chat', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					roomName: params.roomName,
				}),
			});
			const result = await deleteCall.json();
			clearStorage();
			console.log(result);
		} catch (error) {
			console.log('Error in removing messages ', error);
		}
	};

	const sendMessage = () => {
		if (msgInput !== '' && socket) {
			let room = params.roomName;
			socket.emit('sendmessage', {
				room,
				msg: msgInput,
				token: token
			});
			setMsgInput('');
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			sendMessage();
		}
	};

	return (
		<main>
			<h2>{name}</h2>
			<button onClick={() => deleteMessages()}>Delete</button>
			{minutes && <Timer minutes={minutes} startTimer={startTimer} />}
			<input
				type='text'
				value={msgInput}
				onKeyDown={handleKeyDown}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setMsgInput(e.target.value)
				}
				className='text-black'
			/>
			<button
				className='bg-gray-500 p-2 m-2 hover:bg-gray-400'
				onClick={() => sendMessage()}
			>
				Send
			</button>
			{message.map((data, index) => {
				return (
					<p key={index} className='text-xl text-white '>
						{data}
					</p>
				);
			})}
		</main>
	);
}
