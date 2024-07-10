'use client';

import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import Timer from '../../components/Timer';
import {
	getUsername,
	getSeconds,
	getMinutes,
	getToken,
	getRoomname,
	clearStorage,
} from '@/app/utils/LocalStorage';
import SendIcon from '@/app/icons/SendIcon';
import FileIcon from '@/app/icons/FileIcons';
import toast, { Toaster } from 'react-hot-toast';
import serverURL from '@/app/utils/ServerURI';
import MessagesSkeleton from '@/app/components/MessagesSkeleton';

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
	const fileRef = useRef<null | HTMLInputElement>(null);

	const [socket, setSocket] = useState<Socket | null>();
	const [msgInput, setMsgInput] = useState('');
	const [message, setMessage] = useState<messageT[]>([]);
	const [startTimer, setStartTimer] = useState(false);
	const [minutes, setMinutes] = useState<number>();
	const [name, setName] = useState<string | null>('');
	const [token, setToken] = useState<string | null>('');
	const [roomName, setRoomName] = useState<string | null>('');
	const allowedDocTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
	const allowedImageTypes = ['image/png', 'image/jpeg'];

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
		const _roomName = getRoomname();
		setName(_name);
		setToken(_token);
		setRoomName(_roomName);

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

		newSocket.on('connect_error', (err: CustomError) => {
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
				socketMessage.sender !== name &&
					setMessage((prevMessage) => [...prevMessage, socketMessage]);
			};

			socket.on('emitMessage', handleMessage);

			socket.on('new-image', (data: string) => {
				// setImages((prevImages) => [...prevImages, data]);
				console.log('UPLOAD Data: ', data);
			});

			socket.on('new-document', (data: string) => {
				// setDocuments((prevDocuments) => [...prevDocuments, data]);
				console.log('UPLOAD Data: ', data);
			});

			socket.on('upload-error', (error) => {
				console.error('Upload error:', error.message);
				// Handle error (e.g., show an error message to the user)
			});

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
				socket.off('new-image');
				socket.off('new-document');
				socket.off('upload-error');
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

	const handleFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			const fileData = e.target?.result as string;
			const fileType = file.type;
			
			if (fileType.startsWith('image/') && !allowedImageTypes.includes(fileType)) {
				toast.error('Only PNGs and JPGs are allowed!');
				return;
			}

			if (fileType.startsWith('application/') && !allowedDocTypes.includes(fileType)) {
				toast.error('Invalid document type!');
				return;
			}

			console.log("file ", file.name, " \n File data: ", fileData, '\n type: ', fileType);
			if (fileType.startsWith('image/')) {
				// socket?.emit('upload-image', { fileName: file.name, fileData });
			} else if (fileType.startsWith('application')) {
				// socket?.emit('upload-document', { fileName: file.name, fileData });
			}
		};

		reader.readAsDataURL(file);
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
			setMessage((prevMessage) => [
				...prevMessage,
				{ msg: msgInput, sender: name as string },
			]);
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
			{/* <div className='flex items-center justify-between'>
				{minutes && (
					<Timer
						minutes={minutes}
						startTimer={startTimer}
						kickOutUsers={kickOutUsers}
					/>
				)}
				<h2 className='md:text-3xl text-base'>{roomName}</h2>

				<button
					onClick={() => leaveRoom()}
					className='m-4 bg-green-1 w-1/6 rounded py-2 px-1 md:text-xl text-md hover:bg-green-600'
				>
					Leave
				</button>
			</div> */}

			<div
				className='flex flex-col justify-end mt-2 flex-grow'
				style={{ maxHeight: '64vh' }}
			>
				<div className='overflow-y-scroll flex flex-col'>
					{message ? (
						message.map((data, index) => (
							<p
								key={index}
								className={`text-md md:text-lg text-white tracking-tighter w-[90%] h-auto px-4 py-2 rounded ${
									data.sender === name ? 'bg-green-1 self-end' : 'bg-gray-800'
								} my-2`}
							>
								{data.msg}
							</p>
						))
					) : (
						<MessagesSkeleton />
					)}
					<div ref={endRef}></div>
				</div>
			</div>

			<div className='flex items-center mb-1 mt-auto'>
				<input
					type='text'
					placeholder='Type a message ...'
					value={msgInput}
					onKeyDown={handleKeyDown}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setMsgInput(e.target.value)
					}
					className='placeholder:italic text-black rounded py-1 px-2 text-lg focus:ring-2 focus:ring-green-1 focus:outline-none outline-none w-full tracking-tighter'
				/>

				<input
					type='file'
					onChange={handleFile}
					className='hidden'
					ref={fileRef}
				/>
				<button
					className='flex items-center justify-center py-2 px-4 rounded bg-green-1 ml-2 hover:bg-green-600'
					onClick={() => fileRef.current?.click()}
				>
					<FileIcon />
				</button>
				<button
					className='flex items-center justify-center py-2 px-4 rounded bg-green-1 m-2 hover:bg-green-600'
					onClick={() => sendMessage()}
				>
					<SendIcon />
				</button>
			</div>
			<Toaster />
		</div>
	);
}
