'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomNames from '../utils/RoomNames';

const CreateRoom = () => {
	const router = useRouter();

	const [email, setEmail] = useState('');

	const invite = async () => {
		const roomName = RoomNames[Math.floor(Math.random() * 100)]
		const request = await fetch('http://localhost:5000/invite', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set the correct Content-Type
			},
			body: JSON.stringify({ username: 'Elon Musk', email: email, roomName: roomName}),
		});

		const result = await request.json();
		if (result && request.status === 200) {
			localStorage.setItem('token', result.token);
			router.push(`/rooms/${roomName}`);
		}
	};
	return (
		<div>
			<p>Create Instant Room</p>
			<input
				type='email'
				placeholder='Enter your friends email address'
				value={email}
				className='text-black'
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setEmail(e.target.value)
				}
			/>
			<button onClick={() => invite()}>Let&apos;s Go</button>
		</div>
	);
};

export default CreateRoom;
