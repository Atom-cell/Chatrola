'use client';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export default function Home() {
	const [sock, setSocket] = useState<Socket | null>();
	const [id, setId] = useState('');

	useEffect(() => {
		const newSocket = io('http://localhost:5000'); // Create socket instance

		newSocket.on('connect', () => {
			console.log('Connected to server'); // Log connection status
		});

		newSocket.on('disconnect', () => {
			console.log('Disconnected from server'); // Log disconnection status
		});

		newSocket.on('UserID', (message) => {
			setId(message);
		});

		setSocket(newSocket); // Store socket instance in state

		return () => {
			newSocket.disconnect(); // Disconnect on cleanup
		};
	}, []);

	return (
		<main>
			<button onClick={() => sock?.emit('message', `Hello There ${id}`)}>
				Hello
			</button>
		</main>
	);
}
