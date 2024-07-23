import React from 'react';
import CreateRoom from '../components/CreateRoom';
import LayoutWithHeader from '../components/LayoutWithHeader';

const page = () => {
	return (
		<LayoutWithHeader>
			<div className='flex flex-col items-center w-screen h-screen space-y-6'>
				<h3 className='text-slate-200 md:text-4xl text-3xl font-extrabold my-12'>
					Create an Instant Room
				</h3>
				<CreateRoom />
			</div>
		</LayoutWithHeader>
	);
};

export default page;
