'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import io from 'socket.io-client';
import {
	setMinutes,
	setToken,
	setUsername,
	getUsername,
} from '@/app/utils/LocalStorage';
import Button from '@/app/components/Button';
import toast, { Toaster } from 'react-hot-toast';
import serverURL from '@/app/utils/ServerURI';
import Spinner from '@/app/components/Spinner';
import { CustomError } from '@/app/utils/Types';
import LayoutWithHeader from '../../components/LayoutWithHeader';

const InvitePage = ({ params }: { params: { roomName: string } }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [username, setusername] = useState('');
	const [validInvite, setValidInvite] = useState<boolean | null>(null);
	const [error, setError] = useState('');
	const [expired, setExpired] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const checkInviteExpiration = async () => {
			const inviteToken = searchParams.get('token') as string;
			try {
				setLoading(true);
				const checkInviteCall = await fetch(`${serverURL}/invite`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${inviteToken}`,
					},
				});
				const result = await checkInviteCall.json();
				if (result) {
					console.log('validity of token : ', result.validity);
					if (!result.validity) {
						toast.error('Invite link expired!');
						setExpired(true);
						setError('Invite expired');
					}
					setValidInvite(result.validity);
					setLoading(false);
				}
			} catch (error) {
				setLoading(false);
				console.log('Error in checking invite expiration ', error);
			}
		};

		const username = getUsername();
		if (username) router.push(`/rooms/${params.roomName}`);
		else {
			checkInviteExpiration();
		}
	}, []);

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (username.length < 3) {
			setError('Username must be atleast 3 characters');
			return;
		}
		if (validInvite && !loading) {
			setLoading(true);
			const newSocket = io(serverURL, {
				withCredentials: true,
			});

			newSocket.on('connect', () => {
				console.log('Connected to server');
			});

			newSocket.on('connect_error', (err: CustomError) => {
				console.error('Connection error:', err.message);
				console.error('Error description:', err.description);
				console.error('Error context:', err.context);
			});

			const minutes = searchParams.get('minutes') as string;
			newSocket.emit('generate-token', {
				username: username,
				minutes: minutes,
			});
			setMinutes(minutes);

			newSocket.on('token-generated', (token) => {
				setLoading(false);
				setToken(token);
				setUsername(username);
				router.push(`/rooms/${params.roomName}`);
			});

			return () => {
				newSocket.disconnect();
			};
		}
	};

	return (
		<LayoutWithHeader>
			<div className=' flex flex-col justify-center items-center md:w-11/12 md:h-11/12 w-screen h-screen space-y-6'>
				<h3 className='text-slate-200 md:text-4xl text-3xl font-extrabold mb-12'>
					Meeting Invite
				</h3>
				<form
					onSubmit={onSubmit}
					className=' flex flex-col justify-center items-center'
				>
					<input
						type='text'
						placeholder='Enter your name'
						value={username}
						className='placeholder:italic text-black py-2 px-2 mb-6 md:text-md rounded focus:ring-2 focus:ring-green-1 focus:outline-none w-80 md:w-96'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setusername(e.target.value)
						}
					/>
					<Button buttonText='Join Room' type='submit' loading={loading} />
					<p className='text-red-500 h-3'>{error}</p>
				</form>
				<Toaster />
			</div>
		</LayoutWithHeader>
	);
};

export default InvitePage;
