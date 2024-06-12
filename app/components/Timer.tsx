'use client';
import React, { useState, useEffect } from 'react';

interface TimerProps {
	minutes: number;
	startTimer: boolean
}

const Timer = ({ minutes, startTimer }: TimerProps) => {
	const [secondsRemaining, setSecondsRemaining] = useState(minutes * 60);

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;
		console.log(startTimer);
		if (startTimer && secondsRemaining > 0) {
			intervalId = setInterval(() => {
				setSecondsRemaining((prevSeconds) => prevSeconds - 1);
			}, 1000);
		} else if (secondsRemaining === 0) {
			clearInterval(intervalId!);
			console.log('Time is up!');
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

	return <div className='text-white text-3xl font-semibold'>{formatTime(secondsRemaining)}</div>;
};

export default Timer;
