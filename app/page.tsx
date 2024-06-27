import React from 'react';
import CreateRoom from './components/CreateRoom';
const page = () => {
	return (
		<div className='flex flex-col justify-center items-center w-full h-full space-y-6'>
			<h3 className='text-slate-200 md:text-4xl text-3xl font-extrabold mb-12'>
				Create Instant Room
			</h3>
			<CreateRoom />
		</div>
	);
};

export default page;
