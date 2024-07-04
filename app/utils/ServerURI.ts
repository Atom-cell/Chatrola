const serverURL: string =
	process.env.NODE_ENV === 'production'
		? 'https://chatrolaserver-production.up.railway.app'
		: 'http://localhost:5000';
export default serverURL;
