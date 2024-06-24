import React from 'react';

type ButtonType = {
	buttonText: string,
	type?: "button" | "reset" | "submit" | undefined;
	clickFn?: () => void;
};
const Button = ({ buttonText, type, clickFn }: ButtonType) => {
	return (
		<button
			type={type && type}
			onClick={() => clickFn && clickFn()}
			className='m-4 bg-green-1 w-2/4 rounded py-2 md:text-xl hover:bg-green-600 hover:translate-y-0.5 hover:translate-x-0.5 transition ease-in-out delay-90 '
		>
			{buttonText}
		</button>
	);
};

export default Button;
