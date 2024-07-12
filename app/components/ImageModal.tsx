import React from 'react';
import { CircleX } from 'lucide-react';
import Image from 'next/image';
const ImageModal = () => {
	return (
		<div className='absolute bottom-24 inset-0 z-50 flex items-center justify-center transition-opacity ease-in duration-700 opacity-100 overflow-y-auto overflow-x-hidden'>
			<div className='relative m-5' style={{maxHeight:'60vh'}}>  
				<div className='relative border border-white rounded-lg shadow'>
                    <CircleX className='text-white absolute right-0 -top-3' />
					<div className='flex justify-center items-center'>
						<Image
							src={""}
							alt='Image'
							// width={100}
							// height={100}
							className='max-h-[29em] max-w-[23em] object-contain my-2'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageModal;
