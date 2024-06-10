'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';

export default function Home({ params }: { params: { roomName: string } }) {
	const router = useRouter();

	const [socket, setSocket] = useState<Socket | null>();
	const [id, setId] = useState('');
	const [msgInput, setMsgInput] = useState('');
	const [message, setMessage] = useState<string[]>([]);

	useEffect(() => {
		const newSocket = io('http://localhost:5000');

		newSocket.on('connect', () => {
			console.log('Connected to server');
		});
		const token = localStorage.getItem('token');
		newSocket.emit('join-room', { roomName: params.roomName, token: token });

		newSocket.on('disconnect', () => {
			console.log('Disconnected from server ');
		});

		newSocket.on('UserID', (message) => {
			setId(message);
		});

		newSocket.on('roomFull', () => {
			alert(`Room is full.`);
			router.push('/');
		});

		newSocket.on('invalidToken', () => {
			alert('INVLAUD TOKEN');
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

			socket.on('invalidToken', () => alert('INVLAUD TOKEN'));

			return () => {
				socket.off('emitMessage', handleMessage);
			};
		}
	}, [socket, message]);

	// sending message
	// const sendMessage= () => {
	// 	// { to: id, message: msgInput }
	// 	socket?.emit('sendmessage', msgInput);
	// 	setMsgInput("");
	// }

	const sendMessage = () => {
		if (msgInput !== '' && socket) {
			let room = params.roomName;
			socket.emit('sendmessage', {
				room,
				msg: msgInput,
				token: localStorage.getItem('token'),
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
