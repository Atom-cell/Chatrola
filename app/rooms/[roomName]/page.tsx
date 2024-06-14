'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import Timer from '../../components/Timer';
import {
	getUsername,
	getSeconds,
	getMinutes,
	getToken,
	clearStorage,
} from '@/app/utils/LocalStorage';

export default function Home({ params }: { params: { roomName: string } }) {
	const router = useRouter();

	const [socket, setSocket] = useState<Socket | null>();
	const [msgInput, setMsgInput] = useState('');
	const [message, setMessage] = useState<string[]>([]);
	const [startTimer, setStartTimer] = useState(false);
	const [minutes, setMinutes] = useState<number>();
	const [name, setName] = useState<string | null>('');
	const [token, setToken] = useState<string | null>('');

	useEffect(() => {
		// get all messages for the room
	}, []);

	useEffect(() => {
		const _name = getUsername();
		const _token = getToken();
		setName(_name);
		setToken(_token);

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

		newSocket.emit('join-room', { roomName: params.roomName, token: _token });

		newSocket.on('disconnect', () => {
			// clearStorage();
			console.log('Disconnected from server ');
		});

		newSocket.on('roomFull', () => {
			alert(`Room is full.`);
			router.push('/');
		});

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

			// when token is expired
			socket.on('invalidToken', (response) => {
				alert(response);
				clearStorage();
				router.push('/');
			});

			socket?.on('time-up', () => {
				alert('Time is up');
				clearStorage();
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
			if (result && result.status === 200) {
				socket?.emit('kickout-users', { roomName: params.roomName });
			}
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
				token: token,
			});
			setMsgInput('');
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			sendMessage();
		}
	};

	const leaveRoom = (): void => {
		clearStorage();
	};

	const kickOutUsers = (): void => {
		deleteMessages();
	};

	return (
		<main>
			<h2>{name}</h2>
			<button onClick={() => leaveRoom()}>Leave</button>
			{/* <button onClick={() => deleteMessages()}>Delete</button> */}
			{minutes && (
				<Timer
					minutes={minutes}
					startTimer={startTimer}
					kickOutUsers={kickOutUsers}
				/>
			)}
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
