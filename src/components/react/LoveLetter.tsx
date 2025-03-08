import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoveLetterProps {
	title?: string
	messages: string[]
	position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
	theme?: 'pink' | 'blue' | 'purple' | 'green'
	heart?: boolean
}

const LoveLetter: React.FC<LoveLetterProps> = ({
	messages,
	position = 'bottom-right',
	title = 'Secret Letter',
	theme = 'blue',
	heart = false
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [currentMessage, setCurrentMessage] = useState(0)
	const [isFlying, setIsFlying] = useState(false)

	const positionClasses = {
		'top-right': 'sticky top-8 right-8 ml-auto',
		'bottom-right': 'sticky bottom-24 right-8 ml-auto mt-[80vh]',
		'top-left': 'sticky top-8 left-8',
		'bottom-left': 'sticky bottom-24 left-8 mt-[80vh]'
	}

	const themeClasses = {
		pink: {
			bg: 'bg-gradient-to-br from-pink-50 to-white dark:from-gray-800 dark:to-gray-900',
			border: 'border-pink-200 dark:border-pink-800',
			title: 'text-pink-600 dark:text-pink-400',
			button:
				'bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-900 dark:hover:bg-pink-800 dark:text-pink-300',
			icon: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 text-pink-500 dark:text-pink-300',
			shadow: 'shadow-pink-200/50 dark:shadow-pink-900/30'
		},
		blue: {
			bg: 'bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900',
			border: 'border-blue-200 dark:border-blue-800',
			title: 'text-blue-600 dark:text-blue-400',
			button:
				'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300',
			icon: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-500 dark:text-blue-300',
			shadow: 'shadow-blue-200/50 dark:shadow-blue-900/30'
		},
		purple: {
			bg: 'bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900',
			border: 'border-purple-200 dark:border-purple-800',
			title: 'text-purple-600 dark:text-purple-400',
			button:
				'bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-300',
			icon: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 text-purple-500 dark:text-purple-300',
			shadow: 'shadow-purple-200/50 dark:shadow-purple-900/30'
		},
		green: {
			bg: 'bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900',
			border: 'border-green-200 dark:border-green-800',
			title: 'text-green-600 dark:text-green-400',
			button:
				'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300',
			icon: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 text-green-500 dark:text-green-300',
			shadow: 'shadow-green-200/50 dark:shadow-green-900/30'
		}
	}

	const currentTheme = themeClasses[theme]

	const toggleLetter = () => {
		if (!isOpen) {
			setIsFlying(true)
			setTimeout(() => {
				setIsFlying(false)
				setIsOpen(true)
			}, 1000)
		} else {
			setIsOpen(false)
		}
	}

	const nextMessage = () => {
		setCurrentMessage((prev) => (prev + 1) % messages.length)
	}

	const prevMessage = () => {
		setCurrentMessage((prev) => (prev - 1 + messages.length) % messages.length)
	}

	return (
		<div className={`${positionClasses[position]} z-[9999] w-fit`}>
			<AnimatePresence>
				{!isOpen && (
					<motion.div
						className='relative cursor-pointer'
						onClick={toggleLetter}
						whileHover={{
							scale: 1.1,
							rotate: 5
						}}
						whileTap={{ scale: 0.9 }}
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{
							opacity: 1,
							scale: 1,
							y: isFlying ? [-20, 0] : 0,
							rotateZ: isFlying ? [-10, 10] : 0
						}}
						transition={{
							duration: isFlying ? 1 : 0.3,
							type: isFlying ? 'tween' : 'spring',
							stiffness: 260,
							damping: 20
						}}
					>
						<div
							className={`flex items-center justify-center w-20 h-20 ${currentTheme.icon} rounded-full shadow-lg ${currentTheme.shadow} select-none`}
						>
							<span className='text-5xl' role='img' aria-label='信件'>
								{heart ? '💌' : '✉️'}
							</span>
							<motion.div
								className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500'
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ repeat: Infinity, duration: 2 }}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						className={`${currentTheme.bg} rounded-2xl shadow-xl p-6 w-80 border-2 ${currentTheme.border} backdrop-blur-sm`}
						initial={{ opacity: 0, y: 20, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.8 }}
						transition={{ type: 'spring', stiffness: 500, damping: 30 }}
					>
						<div className='flex flex-col items-center mb-5 pt-2'>
							<motion.h3
								className={`text-2xl font-bold ${currentTheme.title} font-serif text-center mb-1`}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								{title}
							</motion.h3>
							<div className='w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1'></div>
							<motion.button
								onClick={toggleLetter}
								className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
								whileHover={{ rotate: 90 }}
								whileTap={{ scale: 0.9 }}
							>
								×
							</motion.button>
						</div>

						<motion.div
							key={currentMessage}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.3 }}
							className='italic text-gray-700 dark:text-gray-300 min-h-[130px] flex items-center justify-center text-center p-5 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 font-medium mb-5'
						>
							{messages[currentMessage]}
						</motion.div>

						<div className='flex justify-between items-center mt-6 pt-2 border-t border-gray-200 dark:border-gray-700'>
							<div className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
								{currentMessage + 1}/{messages.length}
							</div>

							<div className='flex gap-2'>
								{messages.length > 1 && (
									<>
										<motion.button
											onClick={prevMessage}
											className={`px-4 py-2 ${currentTheme.button} rounded-full text-sm transition-colors flex items-center gap-1 font-medium`}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											disabled={messages.length <= 1}
										>
											← last
										</motion.button>
										<motion.button
											onClick={nextMessage}
											className={`px-4 py-2 ${currentTheme.button} rounded-full text-sm transition-colors flex items-center gap-1 font-medium`}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											next →
										</motion.button>
									</>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default LoveLetter
