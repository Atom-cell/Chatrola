import React from 'react';
import ChatrolaIcon from '../icons/Icon';

const Header = () => {
	return (
		<header className='container pl-4 py-6'>
			<nav className='flex items-center'>
				<ChatrolaIcon />
				<h2 className='ml-4'>Chatrola</h2>
				{/* <button className='bg-green-1 text-black px-4 py-2 rounded'>
						Sign Up
					</button> */}
			</nav>
		</header>
	);
};

export default Header;
