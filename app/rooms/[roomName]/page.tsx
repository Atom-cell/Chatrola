'use client';

import { useEffect, useState, ChangeEvent } from 'react';
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
import Button from '@/app/components/Button';

export default function Home({ params }: { params: { roomName: string } }) {
	const router = useRouter();

	const [socket, setSocket] = useState<Socket | null>();
	const [msgInput, setMsgInput] = useState('');
	const [message, setMessage] = useState<string[]>(["message 1","message 2", "message 3", "message 4"]);
	const [startTimer, setStartTimer] = useState(false);
	const [minutes, setMinutes] = useState<number>();
	const [name, setName] = useState<string | null>('');
	const [token, setToken] = useState<string | null>('');

	// useEffect(() => {
	// 	// get all messages for the room
	// }, []);

	// useEffect(() => {
	// 	const _name = getUsername();
	// 	const _token = getToken();
	// 	setName(_name);
	// 	setToken(_token);

	// 	const secondsFromMemory = getSeconds();
	// 	if (secondsFromMemory) {
	// 		const minutes = parseInt(secondsFromMemory, 10) / 60;
	// 		setMinutes(minutes);
	// 	} else {
	// 		const minutesString = getMinutes();
	// 		const mins: number =
	// 			minutesString !== null ? parseInt(minutesString, 10) : 0;
	// 		setMinutes(mins);
	// 	}

	// 	const newSocket = io('http://localhost:5000');

	// 	newSocket.on('connect', () => {
	// 		console.log('Connected to server');
	// 	});

	// 	newSocket.emit('join-room', { roomName: params.roomName, token: _token });

	// 	newSocket.on('disconnect', () => {
	// 		// clearStorage();
	// 		console.log('Disconnected from server ');
	// 	});

	// 	newSocket.on('roomFull', () => {
	// 		alert(`Room is full.`);
	// 		router.push('/');
	// 	});

	// 	setSocket(newSocket);

	// 	return () => {
	// 		newSocket.disconnect();
	// 	};
	// }, []);

	// // Receiving message
	// useEffect(() => {
	// 	if (socket) {
	// 		const handleMessage = (socketMessage: string) => {
	// 			console.log('message array ', message, ' socket ', socketMessage);
	// 			setMessage((prevMessage) => [...prevMessage, socketMessage]);
	// 		};

	// 		socket.on('emitMessage', handleMessage);

	// 		// when token is expired
	// 		socket.on('invalidToken', (response) => {
	// 			alert(response);
	// 			deleteMessages();
	// 			clearStorage();
	// 			router.push('/');
	// 		});

	// 		socket?.on('time-up', () => {
	// 			alert('Time is up');
	// 			clearStorage();
	// 			router.push('/');
	// 		});

	// 		socket.on('start-timer', () => {
	// 			console.log('Start timer');
	// 			setStartTimer(true);
	// 		});

	// 		socket.on('stop-timer', () => {
	// 			console.log('Stop Timer');
	// 			setStartTimer(false);
	// 		});

	// 		return () => {
	// 			socket.off('emitMessage', handleMessage);
	// 		};
	// 	}
	// }, [socket, message]);

	const deleteMessages = async (): Promise<void> => {
		try {
			const deleteCall = await fetch('http://localhost:5000/chat', {
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
			console.log(result);
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
		<div className='w-full h-full border border-red-500'>
			{/* <button onClick={() => deleteMessages()}>Delete</button> */}
			<h2 className=''>Joyful Journey</h2>
			{/* <Button buttonText="Leave" clickFn={() => leaveRoom()}/> */}
			{minutes && (
				<Timer
					minutes={minutes}
					startTimer={startTimer}
					kickOutUsers={kickOutUsers}
				/>
			)}
			<div className=''>
				<div className=' border-1 border-green-500 flex flex-col flex-1 h-full'>
					{message.map((data, index) => {
						return (
							<p key={index} className='text-xl text-white '>
								{data}
							</p>
						);
					})}
				</div>

				<div className='flex items-center mt-auto'>
					<input
						type='text'
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
			</div>
		</div>
	);
}
