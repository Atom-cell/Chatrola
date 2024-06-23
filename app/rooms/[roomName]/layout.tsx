export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<div className='flex p-5 justify-center items-center bg-gray-500 h-screen'>
				{children}
			</div>
		</html>
	);
}
