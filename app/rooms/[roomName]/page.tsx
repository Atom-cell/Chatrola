'use client';

import { useEffect, useState, ChangeEvent, useRef, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import Timer from '../../components/Timer';
import {
	getUsername,
	getSeconds,
	getMinutes,
	getToken,
	clearStorage,
} from '@/app/utils/LocalStorage';
import SendIcon from '@/app/icons/SendIcon';
import toast, { Toaster } from 'react-hot-toast';
import serverURL from '@/app/utils/ServerURI';

export default function Home({ params }: { params: { roomName: string } }) {
	type messageT = {
		msg: string;
		sender: string;
	};

	type responseT = {
		_id: string;
		message: string;
		username: string;
		timestamp: string;
	};

	interface CustomError extends Error {
		description?: string;
		context?: any;
	}

	const router = useRouter();

	const endRef = useRef<null | HTMLDivElement>(null);

	const [socket, setSocket] = useState<Socket | null>();
	const [msgInput, setMsgInput] = useState('');
	const [message, setMessage] = useState<messageT[]>([]);
	const [startTimer, setStartTimer] = useState(false);
	const [minutes, setMinutes] = useState<number>();
	const [name, setName] = useState<string | null>('');
	const [token, setToken] = useState<string | null>('');

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [message]);

	const getRoomMessages = async () => {
		const _token = getToken();
		try {
			const getCall = await fetch(`${serverURL}/chat/${params.roomName}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${_token}`,
				},
			});
			const result = await getCall.json();

			console.log(result);
			if (result) {
				setMessage(
					result.map((res: responseT) => {
						return { msg: res.message, sender: res.username };
					})
				);
			}
		} catch (error) {
			console.log('Error in getting messages ', error);
		}
	};

	useEffect(() => {
		const _name = getUsername();
		const _token = getToken();
		setName(_name);
		setToken(_token);

		const secondsFromMemory = getSeconds();
		if (secondsFromMemory) {
			const minutes = parseInt(secondsFromMemory, 10) / 60;
			setMinutes(minutes);
		} else {
			const minutesString = getMinutes();
			const mins: number =
				minutesString !== null ? parseInt(minutesString, 10) : 0;
			setMinutes(mins);
		}

		const newSocket = io(serverURL);

		newSocket.on('connect', () => {
			console.log('Connected to Socket server');
		});

		newSocket.on('connect_error', (err:CustomError) => {
			console.error('Connection error:', err.message);
			console.error('Error description:', err.description);
			console.error('Error context:', err.context);
		});

		newSocket.emit('join-room', { roomName: params.roomName, token: _token });

		newSocket.on('disconnect', () => {
			// clearStorage();
			console.log('Disconnected from server ');
		});

		newSocket.on('roomFull', () => {
			toast.error('Room is full 😤');
			router.push('/');
		});

		setSocket(newSocket);

		getRoomMessages();

		return () => {
			newSocket.disconnect();
		};
	}, []);

	// Receiving message
	useEffect(() => {
		if (socket) {
			const handleMessage = (socketMessage: messageT) => {
				console.log('message array ', message, ' socket ', socketMessage);
				setMessage((prevMessage) => [...prevMessage, socketMessage]);
			};

			socket.on('emitMessage', handleMessage);

			// when token is expired
			socket.on('invalidToken', (response) => {
				toast.error(response);
				deleteMessages();
				clearStorage();
				router.push('/');
			});

			socket?.on('time-up', () => {
				toast.error('Time is up!');
				clearStorage();
				router.push('/');
			});

			socket.on('start-timer', () => {
				console.log('Start timer');
				toast.success('🎉 Your friend joined the room.');
				setStartTimer(true);
			});

			socket.on('stop-timer', () => {
				console.log('Stop Timer');
				toast.error('Your friend left the room 🙁');
				setStartTimer(false);
			});

			return () => {
				socket.off('emitMessage', handleMessage);
			};
		}
	}, [socket]);

	const deleteMessages = async (): Promise<void> => {
		try {
			const deleteCall = await fetch(`${serverURL}/chat`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					roomName: params.roomName,
				}),
			});
			const result = await deleteCall.json();
			// if (result && result.status === 200) {
			// 	socket?.emit('kickout-users', { roomName: params.roomName });
			// }
			clearStorage();
			console.log('DELETE----- ', result);
		} catch (error) {
			console.log('Error in removing messages ', error);
		}
	};

	//! token expire but time not over.
	//! set 1 minute room
	const sendMessage = () => {
		if (msgInput !== '' && socket) {
			let room = params.roomName;
			socket.emit('sendmessage', {
				room,
				msg: msgInput,
				token: token,
				sender: name,
			});
			setMsgInput('');
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			sendMessage();
		}
	};

	const leaveRoom = (): void => {
		deleteMessages();
		clearStorage();
		router.push('/');
	};

	const kickOutUsers = (): void => {
		deleteMessages();
		socket?.emit('kickout-users', { roomName: params.roomName });
	};

	return (
		<div className='w-full h-full flex flex-col shadow-md '>
			<div className='flex items-center justify-between'>
				<h2 className='md:text-3xl text-base'>Joyful Journey</h2>
				{minutes && (
					<Timer
						minutes={minutes}
						startTimer={startTimer}
						kickOutUsers={kickOutUsers}
					/>
				)}

				<button
					onClick={() => leaveRoom()}
					className='m-4 bg-green-1 w-1/6 rounded py-2 px-1 md:text-xl text-md hover:bg-green-600 hover:translate-y-0.5 hover:translate-x-0.5 transition ease-in-out delay-90 '
				>
					Leave
				</button>
			</div>
			{/* <div className='flex flex-col h-full'> */}

			<div
				className='overflow-y-scroll mt-2 flex flex-col '
				style={{ maxHeight: '60vh' }}
			>
				{message.map((data, index) => (
					<p
						key={index}
						className={` text-sm md:text-lg text-white tracking-tighter w-[90%] h-auto px-4 py-2 rounded ${
							data.sender === name ? 'bg-green-1 self-end' : 'bg-gray-800'
						} my-2`}
					>
						{data.msg}
					</p>
				))}
				<div ref={endRef}></div>
			</div>

			<div className='flex items-center mb-2 mt-auto'>
				<input
					type='text'
					placeholder='Type a message ...'
					value={msgInput}
					onKeyDown={handleKeyDown}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setMsgInput(e.target.value)
					}
					className='text-black rounded py-1 px-2 text-lg focus:ring-2 focus:ring-green-1 focus:outline-none outline-none w-full tracking-tighter'
				/>
				<button
					className='flex items-center justify-center py-2 px-4 rounded bg-green-1 m-2 hover:bg-green-600'
					onClick={() => sendMessage()}
				>
					<SendIcon />
				</button>
			</div>
			<Toaster />
		</div>
		// </div>
	);
}
