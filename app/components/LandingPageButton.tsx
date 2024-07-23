'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRoomname } from '../utils/LocalStorage';

const LandingPageButton = () => {
	const router = useRouter();

	useEffect(() => {
		const roomname = getRoomname();
		if (roomname) router.push(`/rooms/${roomname}`);
	}, [router]);

	return (
		<div>
			<button
				className='bg-green-1 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold'
				onClick={() => router.push('/create-room')}
			>
				Get Started
			</button>
		</div>
	);
};

export default LandingPageButton;
