export type messageT = {
    msg: string;
    sender: string;
    type: 'text' | 'img' | 'doc';
};

export type responseT = {
    _id: string;
    message: string;
    username: string;
    timestamp: string;
    type: string;
};

export type fileT = {
    name: string;
    type: string;
    data: string;
};

export interface CustomError extends Error {
    description?: string;
    context?: any;
}

export interface TimerProps {
	minutes: number;
	startTimer: boolean;
	kickOutUsers: () => void
}

export type ButtonType = {
	buttonText: string,
	type?: "button" | "reset" | "submit" | undefined;
    clickFn?: (() => void) | (() => Promise<void>);
	loading?:boolean
};