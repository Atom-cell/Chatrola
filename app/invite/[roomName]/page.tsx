'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
const InvitePage = ({ params }: { params: { roomName: string } }) => {
	const router = useRouter();
	const [username, setUsername] = useState('');

	const enterRoom = () => {
		const newSocket = io('http://localhost:5000');

		newSocket.on('connect', () => {
			console.log('Connected to server');
		});

		newSocket.emit('generate-token', { username: username });

		newSocket.on('token-generated', (token) => {
			localStorage.setItem('token', token);
			router.push(`/rooms/${params.roomName}`);
		});
	};

	return (
		<div>
			<input
				type='text'
				className='text-black'
				value={username}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setUsername(e.target.value)
				}
			/>
			<button onClick={() => enterRoom()}>Enter </button>
		</div>
	);
};

export default InvitePage;
