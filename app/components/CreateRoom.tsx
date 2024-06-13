'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomNames from '../utils/RoomNames';
import { setUsername, setToken, setMinutes } from '../utils/LocalStorage';

const CreateRoom = () => {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [minutes, setMinutes] = useState('');
	const [buttonText, setButtonText] = useState("Let's Go");
	const [roomName, setRoomName] = useState("");

	const invite = async () => {
		const room = RoomNames[Math.floor(Math.random() * 100)];
		setRoomName(room);
		if (email && username && minutes) {
			const request = await fetch('http://localhost:5000/invite', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: username,
					email: email,
					roomName: room,
					minutes: minutes,
				}),
			});
	
			const result = await request.json();
			
			if (result && request.status === 200) {
				setUsername(username);
				setToken(result.token);
				setMinutes(result.minutes);
				setButtonText("Join Room");
			}
		} else {
			console.log("Enter valid input")
		}
	};
	return (
		<div className='space-y-5'>
			<p>Create Instant Room</p>
			{/* <Timer minutes={1} /> */}
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
			<button onClick={() => buttonText !== 'Join Room' ? invite() : router.push(`/rooms/${roomName}`)}>{buttonText}</button>
		</div>
	);
};

export default CreateRoom;
