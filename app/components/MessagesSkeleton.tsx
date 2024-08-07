import React from 'react';

const MessagesSkeleton = () => {
	return (
		<div className='flex flex-col gap-y-8'>
			<p className='text-sm md:text-lg text-white tracking-tighter w-[90%] h-10 px-4 py-2 rounded bg-gray-800 my-2 animate-pulse'></p>
			<p className='text-sm md:text-lg text-white tracking-tighter w-[90%] h-10 px-4 py-2 rounded bg-gray-700 my-2 animate-pulse self-end'></p>
			<p className='text-sm md:text-lg text-white tracking-tighter w-[90%] h-10 px-4 py-2 rounded bg-gray-800 my-2 animate-pulse'></p>
			<p className='text-sm md:text-lg text-white tracking-tighter w-[90%] h-10 px-4 py-2 rounded bg-gray-800 my-2 animate-pulse'></p>
		</div>
	);
};

export default MessagesSkeleton;
