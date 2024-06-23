import type { Metadata } from 'next';
import { Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';

const inter = Share_Tech_Mono({
	weight: '400',
	style: 'normal',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Chatrola - A quick one',
	description: 'An instant limited chat app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
