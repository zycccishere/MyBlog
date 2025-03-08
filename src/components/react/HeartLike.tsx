import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeartLikeProps {
	title?: string
}

export const HeartLike: React.FC<HeartLikeProps> = ({ title = '喜欢这篇文章吗？' }) => {
	const [liked, setLiked] = useState(false)
	const [count, setCount] = useState(0)
	const [hearts, setHearts] = useState<{ id: number; x: number; scale: number }[]>([])

	const handleLike = () => {
		setLiked(true)
		setCount((prevCount) => prevCount + 1)

		// 创建2-5个随机心形
		const newHearts = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
			id: Date.now() + i,
			x: Math.random() * 60 - 25, // -25 到 35 之间的随机值
			y: -Math.random() * 15 - 65, // -80 到 -65 之间的随机值
			scale: Math.random() * 0.4 + 0.3, // 0.3 到 0.7 之间的随机值
			color: Math.floor(Math.random() * 12)
		}))

		setHearts((prev) => [...prev, ...newHearts])

		// 2秒后清除心形
		setTimeout(() => {
			setHearts((prev) =>
				prev.filter((heart) => !newHearts.some((newHeart) => newHeart.id === heart.id))
			)
		}, 2000)
	}

	return (
		<div className='flex flex-col items-center justify-center my-8 select-none'>
			<p className='text-lg mb-3 font-medium text-gray-700 dark:text-gray-300'>{title}</p>
			<div className='relative'>
				<motion.button
					className='text-4xl sm:text-5xl focus:outline-none'
					onClick={handleLike}
					whileTap={{ scale: 0.8 }}
				>
					<motion.div
						initial={false}
						animate={liked ? { scale: [1, 1.2, 1] } : {}}
						transition={{ duration: 0.5 }}
					>
						{(() => {
							if (liked) {
								if (count < 10) {
									return '🩷'
								} else if (count < 20) {
									return '💖'
								} else if (count < 50) {
									return '💝'
								} else {
									return '❤️‍🔥'
								}
							} else {
								return '🤍'
							}
						})()}
					</motion.div>
				</motion.button>

				<AnimatePresence>
					{hearts.map((heart) => (
						<motion.div
							key={heart.id}
							className='absolute left-1/2 top-1/2 pointer-events-none'
							initial={{ y: 0, x: heart.x, scale: 0, opacity: 0 }}
							animate={{ y: heart.y, scale: heart.scale, opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 1, ease: 'easeOut' }}
							color={heart.color}
						>
							{(() => {
								if (heart.color === 0) {
									return '🩷'
								} else if (heart.color === 1) {
									return '💜'
								} else if (heart.color === 2) {
									return '🧡'
								} else if (heart.color === 3) {
									return '💛'
								} else if (heart.color === 4) {
									return '🩵'
								} else {
									return '❤️'
								}
							})()}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{count > 0 && (
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className='mt-2 text-sm text-rose-500 dark:text-rose-400'
				>
					{count} likes
				</motion.p>
			)}
		</div>
	)
}

// 为兼容性保留默认导出
export default HeartLike
