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
const InvitePage = ({ params }: { params: { roomName: string } }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [username, setusername] = useState('');
	const [validInvite, setValidInvite] = useState<boolean | null>(null);

	useEffect(() => {
		console.log('CHecking ---- ');

		const checkInviteExpiration = async () => {
			const inviteToken = searchParams.get('token') as string;
			try {
				const checkInviteCall = await fetch('http://localhost:5000/invite', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${inviteToken}`,
					},
				});
				const result = await checkInviteCall.json();
				if (result) {
					console.log(result.validity);
					setValidInvite(result.validity);
				}
			} catch (error) {
				console.log('Error in checking invite expiration ', error);
			}
		};

		const username = getUsername();
		if (username) router.push(`/rooms/${params.roomName}`);
		else checkInviteExpiration();
	}, []);

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (validInvite) {
			const newSocket = io('http://localhost:5000');

			newSocket.on('connect', () => {
				console.log('Connected to server');
			});

			const minutes = searchParams.get('minutes') as string;
			newSocket.emit('generate-token', {
				username: username,
				minutes: minutes,
			});
			setMinutes(minutes);

			newSocket.on('token-generated', (token) => {
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
		<div>
			<form onSubmit={onSubmit}>
				<input
					type='text'
					className='text-black'
					value={username}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setusername(e.target.value)
					}
				/>
				<button type='submit'>Enter</button>
			</form>
		</div>
	);
};

export default InvitePage;
