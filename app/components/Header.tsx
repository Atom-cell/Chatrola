import React from 'react';
import ChatrolaIcon from '../icons/Icon';

const Header = () => {
	return (
		<header className='container pl-4 py-6'>
			<nav className='flex items-center'>
				<ChatrolaIcon />
				<h1 className='ml-4'>Chatrola</h1>
				{/* <button className='bg-green-1 text-black px-4 py-2 rounded'>
						Sign Up
					</button> */}
			</nav>
		</header>
	);
};

export default Header;
