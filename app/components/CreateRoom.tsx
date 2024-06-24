'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import RoomNames from '../utils/RoomNames';
import {
	setUsername,
	setToken,
	setMinutes,
	getRoomname,
	setRoomname,
} from '../utils/LocalStorage';
import Button from './Button';

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
	}, []);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const room = RoomNames[Math.floor(Math.random() * 100)];
		setRoomName(room);

		if (email && username && minutes) {
			// local storage function
			setRoomname(room);
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
		<div className=' flex flex-col justify-center items-center md:w-11/12 md:h-11/12 w-full h-full space-y-6'>
			<h3 className='text-slate-200 md:text-4xl text-3xl font-extrabold mb-12'>
				Create Instant Room
			</h3>
			{/* <Timer minutes={1} /> */}
			<form
				onSubmit={onSubmit}
				className='space-y-6 flex flex-col justify-center items-center'
			>
				<input
					type='text'
					placeholder='Enter your name'
					value={username}
					className='text-black py-2 px-2 md:text-md rounded focus:ring-2 focus:ring-green-1 focus:outline-none w-80 md:w-96'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setUserName(e.target.value)
					}
				/>
				<input
					type='email'
					placeholder="Enter your partner's email"
					value={email}
					className='text-black   py-2 px-2 md:text-md rounded focus:ring-2 focus:ring-green-1 focus:outline-none outline-none w-80 md:w-96'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setEmail(e.target.value)
					}
				/>
				<input
					type='number'
					placeholder='Enter chat minutes'
					value={minutes}
					className='text-black   py-2 px-2 md:text-md rounded focus:ring-2 focus:ring-green-1 focus:outline-none outline-none w-80 md:w-96'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setminutes(e.target.value)
					}
				/>
				{buttonText !== 'Join Room' ? (
					<Button buttonText={buttonText} type='submit'/>
				) : null}
			</form>
			{buttonText === 'Join Room' ? (
				// <button onClick={() => router.push(`/rooms/${roomName}`)}>
				// 	{buttonText}
				// </button>
				<Button buttonText={buttonText} clickFn={() => router.push(`/rooms/${roomName}`)}/>
			) : null}
		</div>
	);
};

export default CreateRoom;
