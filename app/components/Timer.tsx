'use client';
import React, { useState, useEffect } from 'react';
import { setSeconds } from '../utils/LocalStorage';

interface TimerProps {
	minutes: number;
	startTimer: boolean;
	kickOutUsers: () => void
}

const Timer = ({ minutes, startTimer, kickOutUsers }: TimerProps) => {
	const [secondsRemaining, setSecondsRemaining] = useState(minutes * 60);

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;
		// console.log(startTimer);
		if (startTimer && secondsRemaining > 0) {
			intervalId = setInterval(() => {
				setSecondsRemaining((prevSeconds) => {
					const newSeconds = prevSeconds - 1;
					setSeconds(newSeconds.toString());
					return newSeconds;
				});
			}, 1000);
		} else if (secondsRemaining === 0) {
			clearInterval(intervalId!);
			console.log('Time is up!');
			kickOutUsers();
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [startTimer, secondsRemaining]);

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	};

	return (
		<div className='text-white md:text-5xl text-xl font-bold animate-pulse'>
			{formatTime(secondsRemaining)}
		</div>
	);
};

export default Timer;
