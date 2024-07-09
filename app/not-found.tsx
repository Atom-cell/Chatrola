import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
	return (
		<div className='h-screen w-screen flex flex-col justify-center items-center'>
			<h1>Page Not Found</h1>
			<Link href='/'>Go back</Link>
		</div>
	);
};

export default NotFoundPage;
