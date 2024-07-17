import React from 'react';
import Spinner from './Spinner';
import {ButtonType} from '@/app/utils/Types';

const Button = ({ buttonText, type, clickFn, loading }: ButtonType) => {
	return (
		<button
			type={type && type}
			onClick={() => clickFn && clickFn()}
			className='m-4 bg-green-1 w-2/4 rounded py-2 md:text-xl hover:bg-green-600 flex items-center justify-center'
		>
			{loading ? <Spinner width={6} height={6}/> : buttonText}
		</button>
	);
};

export default Button;
