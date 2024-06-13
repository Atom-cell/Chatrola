'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import { setMinutes, setToken } from '@/app/utils/LocalStorage';
const InvitePage = ({ params }: { params: { roomName: string } }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [username, setUsername] = useState('');

	const enterRoom = () => {
		const newSocket = io('http://localhost:5000');

		newSocket.on('connect', () => {
			console.log('Connected to server');
		});

		const minutes = searchParams.get('minutes') as string;
		newSocket.emit('generate-token', { username: username, minutes: minutes });
		setMinutes(minutes);

		newSocket.on('token-generated', (token) => {
			setToken(token)
			router.push(`/rooms/${params.roomName}`);
		});

		return () => {
			newSocket.disconnect();
		};
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
