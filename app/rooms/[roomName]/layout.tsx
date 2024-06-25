export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className=' flex flex-col items-center justify-center h-screen px-8 py-1'>
			{children}
		</div>
	);
}
