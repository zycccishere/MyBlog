import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeEvent {
	time: string // 例如: "2020-03"
	label: string
	title: string
	content: string
	image?: string
}

interface TimeMachineProps {
	events: TimeEvent[]
	title?: string
}

const TimeMachine: React.FC<TimeMachineProps> = ({ events = [], title = '时光机' }) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const dialRef = useRef<HTMLDivElement>(null)
	const clockRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [rotationAngle, setRotationAngle] = useState(0)

	// 初始化角度
	useEffect(() => {
		if (events.length > 0) {
			setRotationAngle((activeIndex / events.length) * 360)
		}
	}, [events.length, activeIndex])

	// 点击事件处理
	const handleClick = (index: number) => {
		setActiveIndex(index)
		if (events.length > 0) {
			setRotationAngle((index / events.length) * 360)
		}
	}

	// 开始拖拽
	const handleDialStart = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	// 拖拽移动
	const handleDialMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
		if (!isDragging || !dialRef.current || !clockRef.current || events.length === 0) return

		// 阻止默认行为
		if (e instanceof Event) e.preventDefault()

		// 获取时钟表盘中心坐标
		const clock = clockRef.current
		const rect = clock.getBoundingClientRect()
		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2

		// 获取鼠标/触摸坐标
		let clientX, clientY
		if ('touches' in e) {
			clientX = e.touches[0].clientX
			clientY = e.touches[0].clientY
		} else if ('clientX' in e) {
			clientX = e.clientX
			clientY = e.clientY
		} else {
			return // 无法获取坐标，提前返回
		}

		// 计算角度（0-360度）
		let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
		angle = angle < 0 ? angle + 360 : angle

		setRotationAngle(angle)

		// 根据角度计算对应的事件索引
		const segmentAngle = 360 / events.length
		let newIndex = Math.round(angle / segmentAngle) % events.length
		if (newIndex < 0) newIndex += events.length
		if (newIndex >= events.length) newIndex = 0

		setActiveIndex(newIndex)
	}

	// 结束拖拽
	const handleDialEnd = () => {
		if (isDragging) {
			setIsDragging(false)

			// 确保指针停在正确的位置
			if (events.length > 0) {
				const segmentAngle = 360 / events.length
				const snapAngle = activeIndex * segmentAngle
				setRotationAngle(snapAngle)
			}
		}
	}

	// 添加全局事件处理函数
	useEffect(() => {
		// 如果正在拖拽，添加全局鼠标移动和鼠标释放事件
		if (isDragging) {
			const handleGlobalMouseMove = (e: MouseEvent) => handleDialMove(e)
			const handleGlobalMouseUp = () => handleDialEnd()

			document.addEventListener('mousemove', handleGlobalMouseMove)
			document.addEventListener('mouseup', handleGlobalMouseUp)
			document.addEventListener('touchmove', handleGlobalMouseMove as unknown as EventListener)
			document.addEventListener('touchend', handleGlobalMouseUp)

			return () => {
				document.removeEventListener('mousemove', handleGlobalMouseMove)
				document.removeEventListener('mouseup', handleGlobalMouseUp)
				document.removeEventListener('touchmove', handleGlobalMouseMove as unknown as EventListener)
				document.removeEventListener('touchend', handleGlobalMouseUp)
			}
		}
	}, [isDragging])

	// 处理边缘情况
	const displayEvents =
		events.length > 0
			? events
			: [
					{
						time: '示例',
						label: '示例标签',
						title: '未添加事件',
						content: '请添加事件数据',
						image: ''
					}
				]

	const currentEvent = displayEvents[activeIndex] || displayEvents[0]

	return (
		<div className='my-12'>
			<h2 className='text-2xl font-bold text-center mb-10 text-indigo-600 dark:text-indigo-400'>
				{title}
			</h2>

			<div className='relative max-w-3xl mx-auto'>
				{/* 时钟表盘 */}
				<div
					ref={clockRef}
					className='relative w-64 h-64 mx-auto mb-8 border-4 border-indigo-200 dark:border-indigo-800 rounded-full bg-white dark:bg-gray-900 shadow-lg'
				>
					{/* 时钟刻度 */}
					{displayEvents.map((_, index) => {
						const angle = (index / displayEvents.length) * 360
						const isActive = index === activeIndex

						return (
							<div
								key={index}
								className={`absolute w-1.5 h-5 ${isActive ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-indigo-300 dark:bg-indigo-700'}`}
								style={{
									left: 'calc(50% - 0.75px)',
									top: '4px',
									transformOrigin: 'bottom center',
									transform: `rotate(${angle}deg)`
								}}
								onClick={() => handleClick(index)}
							></div>
						)
					})}

					{/* 时钟指针 */}
					<div
						ref={dialRef}
						className='absolute top-0 left-1/2 w-2.5 h-28 bg-indigo-600 dark:bg-indigo-400 rounded-full cursor-grab active:cursor-grabbing'
						style={{
							transformOrigin: 'bottom center',
							transform: `translateX(-50%) rotate(${rotationAngle}deg)`,
							top: '16px'
						}}
						onMouseDown={handleDialStart}
						onTouchStart={handleDialStart}
					></div>

					{/* 时钟中心点 */}
					<div className='absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-md'></div>
				</div>

				{/* 事件信息展示区 */}
				<motion.div
					key={activeIndex}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mx-auto'
				>
					<div className='flex flex-col md:flex-row gap-6'>
						{currentEvent.image && (
							<div className='md:w-1/3'>
								<img
									src={currentEvent.image}
									alt={currentEvent.title}
									className='rounded-lg w-full h-auto object-cover max-h-64'
								/>
							</div>
						)}

						<div className={currentEvent.image ? 'md:w-2/3' : 'w-full'}>
							<div className='flex justify-between items-center mb-3'>
								<h3 className='text-xl font-bold text-indigo-600 dark:text-indigo-400'>
									{currentEvent.title}
								</h3>
								<span className='text-sm px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded'>
									{currentEvent.time}
								</span>
							</div>

							<div className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
								{currentEvent.label}
							</div>
							<p className='text-gray-700 dark:text-gray-300'>{currentEvent.content}</p>
						</div>
					</div>
				</motion.div>

				{/* 简易导航 */}
				<div className='flex justify-center mt-6 gap-2'>
					{displayEvents.map((_, index) => (
						<button
							key={index}
							className={`w-3 h-3 rounded-full ${
								index === activeIndex
									? 'bg-indigo-600 dark:bg-indigo-400'
									: 'bg-indigo-200 dark:bg-indigo-800'
							}`}
							onClick={() => handleClick(index)}
						></button>
					))}
				</div>
			</div>
		</div>
	)
}

export default TimeMachine
