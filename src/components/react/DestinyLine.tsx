import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface TimelineEvent {
	date: string
	title: string
	description: string
	image?: string
}

interface DestinyLineProps {
	events: TimelineEvent[]
	title?: string
}

const DestinyLine: React.FC<DestinyLineProps> = ({ events = [], title = '我们的命运交汇' }) => {
	const [visibleEvents, setVisibleEvents] = useState<number[]>([])

	// 为每个事件创建引用
	const eventRefs = useRef<(HTMLDivElement | null)[]>([])

	// 将元素添加到引用数组
	useEffect(() => {
		eventRefs.current = eventRefs.current.slice(0, events.length)
	}, [events.length])

	// 检测哪些事件在视图中
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = Number(entry.target.getAttribute('data-index'))
					if (entry.isIntersecting && !visibleEvents.includes(index)) {
						setVisibleEvents((prev) => [...prev, index])
					}
				})
			},
			{ threshold: 0.3 }
		)

		eventRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref)
		})

		return () => {
			eventRefs.current.forEach((ref) => {
				if (ref) observer.unobserve(ref)
			})
		}
	}, [visibleEvents])

	return (
		<div className='my-12 relative'>
			<h2 className='text-2xl font-bold text-center mb-10 text-red-600 dark:text-red-400'>
				{title}
			</h2>

			{/* 红线 */}
			<div className='absolute left-1/2 top-[10%] bottom-[5%] w-px bg-red-200 dark:bg-red-900 transform -translate-x-1/2'>
				<motion.div
					className='absolute inset-0 bg-red-500'
					initial={{ scaleY: 0 }}
					animate={{ scaleY: visibleEvents.length / Math.max(1, events.length) }}
					transition={{ duration: 0.5 }}
					style={{ transformOrigin: 'top' }}
				/>
			</div>

			{events.map((event, index) => {
				const isEven = index % 2 === 0
				const isVisible = visibleEvents.includes(index)

				return (
					<div
						key={index}
						ref={(el) => (eventRefs.current[index] = el)}
						data-index={index}
						className={`relative flex mb-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
					>
						{/* 左侧或右侧内容 */}
						<motion.div
							className={`w-1/2 px-4 ${isEven ? 'text-right' : 'text-left'}`}
							initial={{ opacity: 0, x: isEven ? -20 : 20 }}
							animate={isVisible ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.6 }}
						>
							<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
								{event.title}
							</h3>
							<p className='text-sm text-red-500 dark:text-red-400 mb-2'>{event.date}</p>
							<p className='text-gray-600 dark:text-gray-300'>{event.description}</p>
						</motion.div>

						{/* 中心点 */}
						<div className='absolute left-1/2 top-0 transform -translate-x-1/2'>
							<motion.div
								className='w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-200 dark:ring-red-900 z-10'
								initial={{ scale: 0 }}
								animate={isVisible ? { scale: 1 } : {}}
								transition={{ duration: 0.3, delay: 0.2 }}
							/>
						</div>

						{/* 图像区域 */}
						{event.image && (
							<motion.div
								className={`w-1/2 px-8 ${isEven ? 'pl-8 pr-4' : 'pr-8 pl-4'}`}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={isVisible ? { opacity: 1, scale: 1 } : {}}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								<img
									src={event.image}
									alt={event.title}
									className='rounded-lg shadow-md w-full max-w-[200px] mx-auto'
								/>
							</motion.div>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default DestinyLine
