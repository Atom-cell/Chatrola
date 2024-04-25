'use client';
import React, { useState } from 'react';

const CreateRoom = () => {
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
            <button>Let&apos;s Go</button>
		</div>
	);
};

export default CreateRoom;
