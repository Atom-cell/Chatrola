import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from 'next';
import { Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Share_Tech_Mono({
	weight: '400',
	style: 'normal',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Chatrola - A quick chat',
	description: 'An instant limited time chat app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='scroll-smooth'>
			<body className={inter.className}>
				<main className='flex flex-col h-screen'>
					{/* <Header /> */}
					{children}
					<Footer />
					<SpeedInsights />
				</main>
			</body>
		</html>
	);
}
