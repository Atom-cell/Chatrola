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
import { Send, Paperclip, CircleX, ArrowDownToLine } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import serverURL from '@/app/utils/ServerURI';
import Spinner from '@/app/components/Spinner';
import MessagesSkeleton from '@/app/components/MessagesSkeleton';
import { messageT, responseT, fileT, CustomError } from '../../utils/Types';
import Image from 'next/image';
import Link from 'next/link';
// import ImageModal from '@/app/components/ImageModal';
import LazyLoad from 'react-lazyload';
import imageCompression from 'browser-image-compression';

export default function Home({ params }: { params: { roomName: string } }) {
	const router = useRouter();
	const endRef = useRef<null | HTMLDivElement>(null);
	const fileRef = useRef<null | HTMLInputElement>(null);

	const [socket, setSocket] = useState<Socket | null>();
	const [msgInput, setMsgInput] = useState('');
	const [message, setMessage] = useState<messageT[]>([]);
	const [messageLoading, setMessageLoading] = useState(false);
	const [startTimer, setStartTimer] = useState(false);
	const [minutes, setMinutes] = useState<number>();
	const [name, setName] = useState<string | null>('');
	const [token, setToken] = useState<string | null>('');
	const [roomName, setRoomName] = useState<string | null>('');
	const [imageProcessLoader, setImageProcessLoader] = useState(false);
	const [file, setFile] = useState<fileT | null>();
	const allowedDocTypes = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-powerpoint',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	];
	const allowedImageTypes = ['image/png', 'image/jpeg'];
	const MAX_IMAGE_SIZE = 6 * 1024 * 1024;

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [message]);

	const getRoomMessages = async () => {
		const _token = getToken();
		try {
			setMessageLoading(true);
			const getCall = await fetch(`${serverURL}/chat/${params.roomName}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${_token}`,
				},
			});
			const result = await getCall.json();

			if (result) {
				// console.log(result);
				setMessage(
					result.map((res: responseT) => {
						return { msg: res.message, sender: res.username, type: res.type };
					})
				);
				setMessageLoading(false);
			}
		} catch (error) {
			console.log('Error in getting messages ', error);
			setMessageLoading(false);
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

			socket.on('new-file', (socketMessage: messageT) => {
				// socketMessage.sender !== name &&
				setMessage((prevMessage) => [...prevMessage, socketMessage]);
				console.log('socketMessage Data: ', socketMessage);
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
				toast.error('Your friend left the room 🙁.');
				setStartTimer(false);
			});

			return () => {
				socket.off('emitMessage', handleMessage);
				socket.off('new-file');
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

	const handleFile = (event: ChangeEvent<HTMLInputElement>): void => {
		setMsgInput('');
		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();

		reader.onload = async (e: ProgressEvent<FileReader>) => {
			setImageProcessLoader(!imageProcessLoader);
			const fileData = e.target?.result as string;
			const fileType = file.type;

			if (fileType.startsWith('image/')) {
				if (!allowedImageTypes.includes(fileType)) {
					toast.error('Only PNGs and JPGs are allowed!');
					setImageProcessLoader(false);
					return;
				}

				if (file.size >= MAX_IMAGE_SIZE) {
					toast.error('7MB is the max image size.');
					setImageProcessLoader(false);
					return;
				}
			} else if (
				fileType.startsWith('application/') ||
				fileType.startsWith('text/')
			) {
				if (!allowedDocTypes.includes(fileType)) {
					toast.error('Invalid document type!');
					setImageProcessLoader(false);
					return;
				}
			} else {
				toast.error('Unsupported file type!');
				setImageProcessLoader(false);
				return;
			}

			if (fileType.startsWith('image/')) {
				try {
					const options = {
						maxSizeMB: 2,
						maxWidthOrHeight: 1920,
						useWebWorker: true,
					};

					const compressedFile = await imageCompression(file, options);

					const reader = new FileReader();
					reader.onload = (e: ProgressEvent<FileReader>) => {
						const fileData = e.target?.result as string;
						setFile({
							name: compressedFile.name,
							type: 'image',
							data: fileData,
						});
						setImageProcessLoader(false);
					};
					reader.readAsDataURL(compressedFile);
				} catch (error) {
					console.error('Error compressing image:', error);
				}
			} else if (fileType.startsWith('application')) {
				setFile({ name: file.name, type: 'doc', data: fileData });
				setImageProcessLoader(false);
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
				type: 'text',
			});
			setMessage((prevMessage) => [
				...prevMessage,
				{ msg: msgInput, sender: name as string, type: 'text' },
			]);
			setMsgInput('');
			setFile(null);
		}
	};

	const sendFile = (): void => {
		if (file && socket) {
			let room = params.roomName;
			socket?.emit('upload-file', {
				fileName: file.name,
				fileData: file.data,
				room,
				token: token,
				sender: name,
				type: file.type,
			});

			setMsgInput('');
			setFile(null);
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

	const loaderProp = ({ src }: { src: string }) => {
		return src;
	};

	return (
		<div className='w-full h-full flex flex-col shadow-md '>
			{/* <ImageModal/> */}
			<div className='flex items-center justify-between'>
				{minutes && (
					<Timer
						minutes={minutes}
						startTimer={startTimer}
						kickOutUsers={kickOutUsers}
					/>
				)}
				<h2 className='md:text-3xl text-base text-black'>{roomName}</h2>

				<button
					onClick={() => leaveRoom()}
					className='ml-4 my-4 bg-green-1 w-1/6 rounded py-2 px-1 md:text-xl text-md hover:bg-green-600 float-right'
				>
					Leave
				</button>
			</div>

			<div
				className='flex flex-col justify-end mt-2 flex-grow'
				style={{ maxHeight: '70vh' }}
			>
				<div className='overflow-y-scroll flex flex-col'>
					{!messageLoading ? (
						message.map((data, index) =>
							data.type === 'text' ? (
								<p
									key={index}
									className={`text-md md:text-lg text-white tracking-tighter w-[90%] h-auto px-4 py-2 rounded ${
										data.sender === name ? 'bg-green-1 self-end' : 'bg-gray-800'
									} my-2`}
								>
									{data.msg}
								</p>
							) : data.type === 'img' ? (
								<Link
									key={index}
									href={`${serverURL}${data.msg}`}
									target='_blank'
									className={`${data.sender === name ? 'self-end' : ''}`}
									rel='noopener noreferrer'
								>
									<LazyLoad height={100}>
										<Image
											src={`${serverURL}${data.msg}`}
											width={150}
											height={150}
											alt='img'
											loader={loaderProp}
											className={`max-h-[20em] max-w-[20em] object-contain my-2`}
										/>
									</LazyLoad>
								</Link>
							) : (
								<div
									className={`${
										data.sender === name ? 'self-end' : ''
									} max-w-[90%] border-2 border-slate-500 rounded flex gap-x-2 p-2 flex-wrap items-center`}
								>
									{data.msg.split('/')[3]}{' '}
									<Link
										href={`${serverURL}${data.msg}`}
										target='_blank'
										download
									>
										<div className='bg-slate-600 rounded-full p-1'>
											<ArrowDownToLine />
										</div>
									</Link>
								</div>
							)
						)
					) : (
						<MessagesSkeleton />
					)}
					<div ref={endRef}></div>
				</div>
			</div>

			<div className='flex items-center mb-1 mt-auto'>
				{file ? (
					<div className='text-lg text-white tracking-tighter w-full border-2 border-gray-500 px-4 py-1 rounded relative'>
						<CircleX
							className='absolute -right-2 -top-4 bg-black cursor-pointer'
							onClick={() => setFile(null)}
						/>
						<p>{file.name}</p>
					</div>
				) : (
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
				)}

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
					<Paperclip className='text-md w-5 h-5' />
				</button>
				<button
					className='flex items-center justify-center py-2 px-4 rounded bg-green-1 ml-2 hover:bg-green-600'
					onClick={() => (file ? sendFile() : sendMessage())}
				>
					{imageProcessLoader ? (
						<Spinner width={20} height={20} />
					) : (
						<Send className='text-md w-5 h-5' />
					)}
				</button>
			</div>
			<Toaster />
		</div>
	);
}
