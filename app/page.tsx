import React from 'react';
import CreateRoom from './components/CreateRoom';
const page = () => {
	return (
		<div className='flex flex-col justify-center items-center w-full h-full space-y-6'>
			{/* <h3 className='text-slate-200 md:text-4xl text-3xl font-extrabold mb-12'>
				Create Instant Room
			</h3>
			<CreateRoom /> */}

			<header className='container mx-auto px-4 py-6'>
				<nav className='flex justify-between items-center'>
					<h1 className='text-2xl font-bold'>QuickChat</h1>
					<button className='bg-green-1 text-black px-4 py-2 rounded'>
						Sign Up
					</button>
				</nav>
			</header>

			<main className='container mx-auto px-4 py-12'>
				<section className='text-center mb-12'>
					<h2 className='text-4xl font-bold mb-4'>
						Connect Instantly, Chat Meaningfully
					</h2>
					<p className='text-xl mb-8'>
						Experience focused conversations in timed chat rooms.
					</p>
					<button className='bg-green-1 text-black px-6 py-3 rounded-lg text-lg font-semibold'>
						Get Started
					</button>
				</section>

				<section className='grid md:grid-cols-3 gap-8 mb-12'>
					<div className='bg-gray-900 p-6 rounded-lg'>
						<h3 className='text-xl font-semibold mb-2'>Timed Chat Rooms</h3>
						<p>Engage in focused discussions lasting 5 to 30 minutes.</p>
					</div>
					<div className='bg-gray-900 p-6 rounded-lg'>
						<h3 className='text-xl font-semibold mb-2'>Invite via Email</h3>
						<p>Easily connect with others using their email address.</p>
					</div>
					<div className='bg-gray-900 p-6 rounded-lg'>
						<h3 className='text-xl font-semibold mb-2'>Rich Media Sharing</h3>
						<p>Exchange messages, images, and documents seamlessly.</p>
					</div>
				</section>

				<section className='text-center'>
					<h2 className='text-3xl font-bold mb-4'>Ready to start chatting?</h2>
					<form className='max-w-md mx-auto'>
						<input
							type='email'
							placeholder='Enter your email'
							className='w-full px-4 py-2 rounded-lg mb-4 text-black'
							required
						/>
						<button
							type='submit'
							className='bg-green-1 text-black px-6 py-3 rounded-lg text-lg font-semibold w-full'
						>
							Join QuickChat
						</button>
					</form>
				</section>
			</main>

			<footer className='bg-gray-900 mt-12 py-6'>
				<div className='container mx-auto px-4 text-center'>
					<p>&copy; 2024 QuickChat. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default page;
