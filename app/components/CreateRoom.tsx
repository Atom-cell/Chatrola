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
	clearStorage,
} from '../utils/LocalStorage';
import Button from './Button';
import toast, { Toaster } from 'react-hot-toast';
import serverURL from '../utils/ServerURI';
import { User, Mail, Hourglass } from 'lucide-react';

const CreateRoom = () => {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [username, setUserName] = useState('');
	const [minutes, setminutes] = useState('');
	const [buttonText, setButtonText] = useState("Let's Go");
	const [roomName, setRoomName] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const roomname = getRoomname();
		if (roomname) router.push(`/rooms/${roomname}`);
	}, []);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const room = RoomNames[Math.floor(Math.random() * 99)];
		setRoomName(room);
		setError('');

		if (username.length < 3) {
			setError('Username must be atleast 3 characters');
			return;
		}

		const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (!email.match(emailRegex)) {
			setError('Invalid Email');
			return false;
		}
		if (!minutes || parseInt(minutes, 10) < 5 || parseInt(minutes, 10) > 30) {
			setError('Minutes can be between 5 and 30 only');
			return;
		}

		if (email && username && minutes && !loading) {
			// local storage function
			try {
				setLoading(true);
				setRoomname(room);
				const request = await fetch(`${serverURL}/invite`, {
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
					toast.success('🎉 Room created.');
					setButtonText('Join Room');
					setLoading(false);
				}
			} catch (error) {
				setLoading(false);
				toast.error('Oops! Error occured');
				console.log(error);
				clearStorage();
			}
		} else {
			console.log('Enter valid input');
		}
	};

	return (
		<div className=' flex flex-col justify-center items-center'>
			<form
				onSubmit={onSubmit}
				className=' flex flex-col justify-center items-center'
			>
				<label htmlFor='Username' className='w-full text-start'>
					Name
				</label>
				<div className='flex justify-center items-center mb-6 focus:ring-2 focus:ring-green-1'>
					<div className='bg-white p-2 rounded-l border-r border-white'>
						<User className='text-black text-xl' />
					</div>
					<input
						type='text'
						placeholder='Enter your name'
						value={username}
						className='placeholder:italic text-black p-2 md:text-md rounded-r border-l border-white focus:outline-none w-80 md:w-96'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setUserName(e.target.value)
						}
					/>
				</div>
				<label htmlFor='Email' className='w-full text-start'>
					Email
				</label>
				<div className='flex justify-center items-center mb-6 focus:ring-2 focus:ring-green-1'>
					<div className='bg-white p-2 rounded-l border-r border-white'>
						<Mail className='text-black text-xl' />
					</div>
					<input
						type='email'
						placeholder="Enter your friend's email"
						value={email}
						className='placeholder:italic text-black p-2 md:text-md rounded-r border-l border-white focus:outline-none w-80 md:w-96'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setEmail(e.target.value)
						}
					/>
				</div>
				<label htmlFor='time' className='w-full text-start'>
					Room Time
				</label>
				<div className='flex justify-center items-center focus:ring-2 focus:ring-green-1'>
					<div className='bg-white p-2 rounded-l border-r border-white'>
						<Hourglass className='text-black text-xl' />
					</div>
					<input
						type='number'
						placeholder='Enter chat minutes'
						value={minutes}
						className='placeholder:italic text-black p-2 md:text-md rounded-r border-l border-white focus:outline-none w-80 md:w-96'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setminutes(e.target.value)
						}
					/>
				</div>

				<span className='w-full mt-1 text-gray-300 text-sm mb-3'>
					Chat can be of miximum of 30 minutes
				</span>

				{buttonText !== 'Join Room' ? (
					<Button buttonText={buttonText} type='submit' loading={loading} />
				) : null}
				<p className='text-red-500 h-3'>{error}</p>
			</form>
			{buttonText === 'Join Room' ? (
				<Button
					buttonText={buttonText}
					clickFn={() => {
						setLoading(!loading);
						router.push(`/rooms/${roomName}`);
					}}
					loading={loading}
				/>
			) : null}
			<Toaster />
		</div>
	);
};

export default CreateRoom;
