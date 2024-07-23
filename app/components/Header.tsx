import React from 'react';
import ChatrolaIcon from '../icons/Icon';

const Header = () => {
	return (
		<header className='w-full pl-4 py-6 align-top'>
			<nav className='flex items-center'>
				<ChatrolaIcon />
				<h2 className='ml-4'>Chatrola</h2>
			</nav>
		</header>
	);
};

export default Header;
