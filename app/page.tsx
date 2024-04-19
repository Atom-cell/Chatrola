'use client'
import { useEffect } from 'react';
import io from 'socket.io-client';

export default function Home() {
  useEffect(() => {
    const socket = io('http://localhost:5000'); // Replace with your server URL
    
    // Socket.IO event listeners and emission logic can be placed here

    return () => {
        socket.disconnect(); // Disconnect the socket when component unmounts
    };
}, []);
  return (
   <main></main>
  );
}
