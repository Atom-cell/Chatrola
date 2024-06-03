'use client';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export default function Home() {
	const [sock, setSocket] = useState<Socket | null>();
	const [id, setId] = useState('');

	useEffect(() => {
		const newSocket = io('http://localhost:5000');

		newSocket.on('connect', () => {
			console.log('Connected to server');
		});

		newSocket.on('disconnect', () => {
			console.log('Disconnected from server ');
		});

		newSocket.on('UserID', (message) => {
			setId(message);
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	return (
		<main>
			<button
				className='bg-gray-500 p-2 m-2 hover:bg-gray-400'
				onClick={() => sock?.emit('message', `Hello There ${id}`)}
			>
				Hello
			</button>
		</main>
	);
}
