const serverURL: string =
	process.env.NODE_ENV === 'production'
		? 'https://chatrola-server.vercel.app'
		: 'http://localhost:5000';
export default serverURL;
