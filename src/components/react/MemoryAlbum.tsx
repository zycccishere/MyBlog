import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Photo {
	src: string
	caption: string
	date?: string
}

interface MemoryAlbumProps {
	photos: Photo[]
	title?: string
}

const MemoryAlbum: React.FC<MemoryAlbumProps> = ({ photos = [], title = '我们的回忆相册' }) => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [direction, setDirection] = useState(0) // -1: 左翻页, 1: 右翻页, 0: 初始状态

	const goToPrevious = () => {
		if (currentIndex > 0) {
			setDirection(-1)
			setCurrentIndex(currentIndex - 1)
		}
	}

	const goToNext = () => {
		if (currentIndex < photos.length - 1) {
			setDirection(1)
			setCurrentIndex(currentIndex + 1)
		}
	}

	if (!photos || photos.length === 0) {
		return <div className='text-center py-8 text-gray-500'>暂无照片</div>
	}

	const currentPhoto = photos[currentIndex]

	// 页面翻转变体
	const pageVariants = {
		enter: (direction: number) => ({
			rotateY: direction > 0 ? 90 : -90,
			opacity: 0,
			scale: 0.9
		}),
		center: {
			rotateY: 0,
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.5
			}
		},
		exit: (direction: number) => ({
			rotateY: direction < 0 ? 90 : -90,
			opacity: 0,
			scale: 0.9,
			transition: {
				duration: 0.5
			}
		})
	}

	return (
		<div className='flex flex-col items-center my-8'>
			<h3 className='text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200'>{title}</h3>

			<div className='relative w-full max-w-md aspect-[4/3] perspective-1000'>
				{/* 相册封面效果 */}
				<div className='absolute inset-0 bg-gradient-to-r from-rose-100 to-teal-100 dark:from-rose-900 dark:to-teal-900 rounded-lg -z-10 transform rotate-1 scale-105 opacity-50'></div>

				<div className='w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden relative'>
					<motion.div
						key={currentIndex}
						custom={direction}
						variants={pageVariants}
						initial='enter'
						animate='center'
						exit='exit'
						className='w-full h-full'
					>
						<div className='relative w-full h-full'>
							<img
								src={currentPhoto.src}
								alt={currentPhoto.caption}
								className='w-full h-full object-cover'
							/>

							<div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4'>
								<p className='text-lg font-medium'>{currentPhoto.caption}</p>
								{currentPhoto.date && <p className='text-sm text-gray-300'>{currentPhoto.date}</p>}
							</div>
						</div>
					</motion.div>
				</div>

				{/* 翻页控制 */}
				<div className='absolute inset-x-0 bottom-[-3rem] flex justify-between items-center'>
					<button
						onClick={goToPrevious}
						disabled={currentIndex === 0}
						className={`w-10 h-10 rounded-full flex items-center justify-center ${
							currentIndex === 0
								? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
								: 'bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
						} shadow transition-colors`}
					>
						←
					</button>

					<div className='text-sm text-gray-500 dark:text-gray-400'>
						{currentIndex + 1} / {photos.length}
					</div>

					<button
						onClick={goToNext}
						disabled={currentIndex === photos.length - 1}
						className={`w-10 h-10 rounded-full flex items-center justify-center ${
							currentIndex === photos.length - 1
								? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
								: 'bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
						} shadow transition-colors`}
					>
						→
					</button>
				</div>
			</div>
		</div>
	)
}

export default MemoryAlbum
