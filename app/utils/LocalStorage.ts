export const setUsername = (name: string): void => {
	localStorage.setItem('name', name);
};

export const setMinutes = (minutes: string): void => {
	localStorage.setItem('minutes', minutes);
};

export const setSeconds = (seconds: string): void => {
	localStorage.setItem('seconds', seconds);
};

export const setToken = (token: string): void => {
	localStorage.setItem('token', token);
};

export const setRoomname = (token: string): void => {
	localStorage.setItem('room', token);
};

export const getUsername = (): string | null => {
	return localStorage.getItem('name');
};

export const getMinutes = (): string | null => {
	return localStorage.getItem('minutes');
};

export const getSeconds = (): string | null => {
	return localStorage.getItem('seconds');
};

export const getToken = (): string | null => {
	return localStorage.getItem('token');
};

export const clearStorage = (): void => {
	localStorage.clear();
}

export const getRoomname = (): string | null => {
	return localStorage.getItem('room');
};