'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const LandingPageButton = () => {
	const router = useRouter();
	return (
		<div>
			<button className='bg-green-1 text-black px-6 py-3 rounded-lg text-lg font-semibold' onClick={() => router.push('/create-room')}>
				Get Started
			</button>
		</div>
	);
};

export default LandingPageButton;
