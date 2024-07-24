import React from 'react';
import LandingPageButton from './components/LandingPageButton';
import LayoutWithHeader from './components/LayoutWithHeader';

const LandingPage = () => {
	return (
		<LayoutWithHeader>
			<div className='flex flex-col justify-center items-center mt-11 md:mt-0'>
				{/* <Header /> */}
				<main className='container my-auto px-4'>
					<section className='text-center mb-12'>
						<h2 className='md:text-4xl font-bold mb-4'>
							Connect Instantly, Chat Meaningfully
						</h2>
						<p className='md:text-xl mb-8'>
							Experience focused conversations in timed chat rooms.
						</p>
						<LandingPageButton />
					</section>

					<section className='grid md:grid-cols-3 gap-8 mb-12'>
						<div className='bg-gray-900 p-6 border border-green-1 shadow cursor-pointer hover:-translate-x-1 hover:-translate-y-1 delay-75	ease-linear	duration-75	transition-transform'>
							<h3 className='text-xl font-semibold mb-2'>Timed Chat Rooms</h3>
							<p>Engage in focused discussions lasting 5 to 30 minutes.</p>
						</div>
						<div className='bg-gray-900 p-6 border border-green-1 shadow cursor-pointer hover:-translate-x-1 hover:-translate-y-1 delay-75	ease-linear	duration-75	transition-transform'>
							<h3 className='text-xl font-semibold mb-2'>Invite via Email</h3>
							<p>Easily connect with others using their email address.</p>
						</div>
						<div className='bg-gray-900 p-6 border border-green-1 shadow cursor-pointer hover:-translate-x-1 hover:-translate-y-1 delay-75	ease-linear	duration-75	transition-transform'>
							<h3 className='text-xl font-semibold mb-2'>Rich Media Sharing</h3>
							<p>Exchange messages, images, and documents seamlessly.</p>
						</div>
					</section>
				</main>
			</div>
		</LayoutWithHeader>
	);
};

export default LandingPage;
