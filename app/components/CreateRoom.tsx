'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import RoomNames from '../utils/RoomNames';
import { setUsername, setToken, setMinutes, getRoomname, setRoomname } from '../utils/LocalStorage';

const CreateRoom = () => {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [username, setUserName] = useState('');
	const [minutes, setminutes] = useState('');
	const [buttonText, setButtonText] = useState("Let's Go");
	const [roomName, setRoomName] = useState('');

	useEffect(() => {
		const roomname = getRoomname();
		if (roomname) router.push(`/rooms/${roomname}`);
	} ,[]);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const room = RoomNames[Math.floor(Math.random() * 100)];
		setRoomName(room);

		// local storage function
		setRoomname(room);

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
				setButtonText('Join Room');
			}
		} else {
			console.log('Enter valid input');
		}
	};
	return (
		<div>
			<p>Create Instant Room</p>
			{/* <Timer minutes={1} /> */}
			<form onSubmit={onSubmit} className='space-y-5'>
				<input
					type='text'
					placeholder='Enter your name'
					value={username}
					className='text-black'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setUserName(e.target.value)
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
						setminutes(e.target.value)
					}
				/>
				{buttonText !== 'Join Room' ? (
					<button type='submit'>{buttonText}</button>
				) : null}
			</form>
			{buttonText === 'Join Room' ? (
				<button onClick={() => router.push(`/rooms/${roomName}`)}>
					{buttonText}
				</button>
			) : null}
		</div>
	);
};

export default CreateRoom;
