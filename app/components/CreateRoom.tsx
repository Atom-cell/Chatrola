'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomNames from '../utils/RoomNames';

const CreateRoom = () => {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [minutes, setMinutes] = useState('');

	const invite = async () => {
		const roomName = RoomNames[Math.floor(Math.random() * 100)];
		const request = await fetch('http://localhost:5000/invite', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Set the correct Content-Type
			},
			body: JSON.stringify({
				username: username,
				email: email,
				roomName: roomName,
				minutes: minutes,
			}),
		});

		const result = await request.json();
		if (result && request.status === 200) {
			localStorage.setItem('token', result.token);
			router.push(`/rooms/${roomName}`);
		}
	};
	return (
		<div className='space-y-5'>
			<p>Create Instant Room</p>
			<input
				type='text'
				placeholder='Enter your name'
				value={username}
				className='text-black'
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setUsername(e.target.value)
				}
			/>
			<input
				type='email'
				placeholder='Enter your friends email address'
				value={email}
				className='text-black block'
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setEmail(e.target.value)
				}
			/>
			<input
				type='number'
				placeholder='Enter your friends email address'
				value={minutes}
				className='text-black block'
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setMinutes(e.target.value)
				}
			/>
			<button onClick={() => invite()}>Let&apos;s Go</button>
		</div>
	);
};

export default CreateRoom;
