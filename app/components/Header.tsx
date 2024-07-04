import React from 'react';
import ChatrolaIcon from '../icons/Icon';

const Header = () => {
	return (
		<div className='w-full gap-4 flex items-center h-auto p-3 shadow-md shadow-green-1'>
			{/* <ChatrolaIcon /> */}
			<p className='font-semibold text-2xl md:text-3xl'>Chatrola</p>
		</div>
	);
};

export default Header;
