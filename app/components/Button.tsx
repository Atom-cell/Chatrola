import React from 'react';
import Spinner from './Spinner';

type ButtonType = {
	buttonText: string,
	type?: "button" | "reset" | "submit" | undefined;
	clickFn?: () => void;
	loading?:boolean
};
const Button = ({ buttonText, type, clickFn, loading }: ButtonType) => {
	return (
		<button
			type={type && type}
			onClick={() => clickFn && clickFn()}
			className='m-4 bg-green-1 w-2/4 rounded py-2 md:text-xl hover:bg-green-600 flex items-center justify-center'
		>
			{loading ? <Spinner /> : buttonText}
		</button>
	);
};

export default Button;
