import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
	return (
		<div className='h-screen w-screen flex flex-col justify-center items-center'>
			<h1>Page Not Found</h1>
			<Link href='/' className='text-green-1 font-bold text-xl hover:underline'>Go back</Link>
		</div>
	);
};

export default NotFoundPage;
