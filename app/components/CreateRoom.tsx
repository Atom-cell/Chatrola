'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'


const CreateRoom = () => {
	const router = useRouter();

	const [email, setEmail] = useState('');
	return (
		<div>
			<p>Create Instant Room</p>
			<input
				type='email'
				placeholder='Enter your friends email address'
				value={email}
				onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
			/>
            <button onClick={() => router.push('/home')}>Let&apos;s Go</button>
		</div>
	);
};

export default CreateRoom;
