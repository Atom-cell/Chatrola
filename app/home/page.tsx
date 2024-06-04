'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import io, { Socket } from 'socket.io-client';

export default function Home() {
	const [socket, setSocket] = useState<Socket | null>();
	const [id, setId] = useState('');
	const [msgInput, setMsgInput] = useState("");
	const [message, setMessage] = useState<string []>([])

	useEffect(() => {
		const newSocket = io('http://localhost:5000');

		newSocket.on('connect', () => {
			console.log('Connected to server');
		});

		newSocket.on('disconnect', () => {
			console.log('Disconnected from server ');
		});

		newSocket.on('UserID', (message) => {
			setId(message);
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	useEffect(() => {
        if (socket) {
            const handleMessage = (socketMessage: string) => {
                console.log("message array ", message, " socket ", socketMessage);
                setMessage(prevMessage => [...prevMessage, socketMessage]);
            };

            socket.on('emitMessage', handleMessage);

            return () => {
                socket.off('emitMessage', handleMessage);
            };
        }
    }, [socket, message]);

	const sendMessage= () => {
		socket?.emit('sendmessage', msgInput);
		setMsgInput("");
	}


	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };
	
	return (
		<main>
			<input type="text" value={msgInput} onKeyDown={handleKeyDown} onChange={(e: ChangeEvent<HTMLInputElement>) => setMsgInput(e.target.value)} className="text-black"/>
			<button
				className='bg-gray-500 p-2 m-2 hover:bg-gray-400'
				onClick={() => sendMessage()}
			>
				Send
			</button>
			{message.map((data, index) => {
				return <p key={index} className="text-xl text-white ">{data}</p>
			})}
		</main>
	);
}