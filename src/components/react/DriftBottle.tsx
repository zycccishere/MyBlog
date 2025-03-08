import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
	id: string
	text: string
	author?: string
	createdAt: string
}

interface DriftBottleProps {
	title?: string
	defaultMessages?: Message[]
	maxMessages?: number
}

const DriftBottle: React.FC<DriftBottleProps> = ({
	title = '爱的漂流瓶',
	defaultMessages = [],
	maxMessages = 30
}) => {
	const [messages, setMessages] = useState<Message[]>(defaultMessages)
	const [newMessage, setNewMessage] = useState('')
	const [authorName, setAuthorName] = useState('')
	const [isReading, setIsReading] = useState(false)
	const [currentMessage, setCurrentMessage] = useState<Message | null>(null)
	const [isComposing, setIsComposing] = useState(false)
	const [bottlePosition, setBottlePosition] = useState({ x: 0, y: 0 })
	const [showSuccess, setShowSuccess] = useState(false)

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const bottlesRef = useRef<
		Array<{
			x: number
			y: number
			angle: number
			speed: number
			amplitude: number
			frequency: number
			phase: number
			message: Message
			scale: number
		}>
	>([])

	// 海浪动画
	useEffect(() => {
		if (!canvasRef.current) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const setCanvasSize = () => {
			canvas.width = canvas.clientWidth
			canvas.height = canvas.clientHeight
		}

		setCanvasSize()
		window.addEventListener('resize', setCanvasSize)

		// 创建瓶子
		const initBottles = () => {
			bottlesRef.current = messages.map((message) => ({
				x: Math.random() * canvas.width,
				y: 40 + Math.random() * (canvas.height - 80),
				angle: Math.random() * 40 - 20,
				speed: 0.2 + Math.random() * 0.4,
				amplitude: 5 + Math.random() * 10,
				frequency: 0.01 + Math.random() * 0.02,
				phase: Math.random() * Math.PI * 2,
				message,
				scale: 0.8 + Math.random() * 0.4
			}))
		}

		initBottles()

		let animationFrame: number
		let time = 0

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			// 绘制海水背景
			const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
			gradient.addColorStop(0, 'rgba(100, 200, 255, 0.2)')
			gradient.addColorStop(1, 'rgba(0, 100, 200, 0.4)')
			ctx.fillStyle = gradient
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			// 绘制波浪
			const drawWave = (
				yOffset: number,
				amplitude: number,
				frequency: number,
				color: string,
				alpha: number
			) => {
				ctx.beginPath()
				ctx.moveTo(0, yOffset)

				for (let x = 0; x < canvas.width; x += 5) {
					const y = yOffset + Math.sin(x * frequency + time) * amplitude
					ctx.lineTo(x, y)
				}

				ctx.lineTo(canvas.width, canvas.height)
				ctx.lineTo(0, canvas.height)
				ctx.closePath()

				ctx.fillStyle = color.replace(')', `, ${alpha})`)
				ctx.fill()
			}

			// 绘制多层波浪
			drawWave(canvas.height * 0.7, 15, 0.02, 'rgba(50, 150, 220', 0.2)
			drawWave(canvas.height * 0.75, 10, 0.03, 'rgba(70, 170, 240', 0.3)
			drawWave(canvas.height * 0.8, 8, 0.04, 'rgba(90, 190, 255', 0.4)

			// 更新和绘制瓶子
			bottlesRef.current.forEach((bottle, index) => {
				// 移动瓶子
				bottle.x += bottle.speed

				// 波浪运动
				bottle.y = bottle.y + Math.sin(time * 0.5 + bottle.phase) * 0.5

				// 循环
				if (bottle.x > canvas.width + 50) {
					bottle.x = -50
					bottle.y = 40 + Math.random() * (canvas.height - 80)
				}

				// 绘制瓶子
				ctx.save()
				ctx.translate(bottle.x, bottle.y)
				ctx.rotate(((Math.sin(time * 0.5 + bottle.phase) * 5 + bottle.angle) * Math.PI) / 180)
				ctx.scale(bottle.scale, bottle.scale)

				// 瓶子形状
				ctx.fillStyle = 'rgba(220, 240, 255, 0.7)'
				ctx.beginPath()
				ctx.arc(0, 0, 15, 0, Math.PI * 2)
				ctx.fill()

				ctx.fillStyle = 'rgba(220, 240, 255, 0.9)'
				ctx.beginPath()
				ctx.ellipse(0, 15, 8, 15, 0, 0, Math.PI * 2)
				ctx.fill()

				// 瓶塞
				ctx.fillStyle = 'rgba(160, 120, 80, 0.9)'
				ctx.beginPath()
				ctx.ellipse(0, -10, 5, 3, 0, 0, Math.PI * 2)
				ctx.fill()

				ctx.restore()

				// 检测点击
				if (!isReading && !isComposing) {
					const dx = bottlePosition.x - bottle.x
					const dy = bottlePosition.y - bottle.y
					const distance = Math.sqrt(dx * dx + dy * dy)

					if (distance < 20 * bottle.scale) {
						setCurrentMessage(bottle.message)
						setIsReading(true)
						setBottlePosition({ x: 0, y: 0 })
					}
				}
			})

			time += 0.05
			animationFrame = requestAnimationFrame(animate)
		}

		animate()

		return () => {
			cancelAnimationFrame(animationFrame)
			window.removeEventListener('resize', setCanvasSize)
		}
	}, [messages, isReading, isComposing, bottlePosition])

	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (isReading || isComposing) return

		const canvas = canvasRef.current
		if (!canvas) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		setBottlePosition({ x, y })
	}

	const addMessage = () => {
		if (!newMessage.trim()) return

		const message: Message = {
			id: Date.now().toString(),
			text: newMessage.trim(),
			author: authorName.trim() || undefined,
			createdAt: new Date().toISOString()
		}

		// 添加消息并限制数量
		setMessages((prev) => [message, ...prev].slice(0, maxMessages))
		setNewMessage('')
		setAuthorName('')
		setIsComposing(false)
		setShowSuccess(true)

		// 3秒后隐藏成功消息
		setTimeout(() => {
			setShowSuccess(false)
		}, 3000)

		// 更新漂流瓶
		if (canvasRef.current) {
			const canvas = canvasRef.current

			bottlesRef.current.unshift({
				x: -50,
				y: 40 + Math.random() * (canvas.height - 80),
				angle: Math.random() * 40 - 20,
				speed: 0.2 + Math.random() * 0.4,
				amplitude: 5 + Math.random() * 10,
				frequency: 0.01 + Math.random() * 0.02,
				phase: Math.random() * Math.PI * 2,
				message,
				scale: 0.8 + Math.random() * 0.4
			})

			// 限制瓶子数量
			if (bottlesRef.current.length > maxMessages) {
				bottlesRef.current = bottlesRef.current.slice(0, maxMessages)
			}
		}
	}

	return (
		<div className='my-12 mx-auto max-w-4xl'>
			<h2 className='text-2xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400'>
				{title}
			</h2>

			<div className='relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg bg-blue-50 dark:bg-blue-900'>
				<canvas
					ref={canvasRef}
					className='absolute inset-0 w-full h-full cursor-pointer'
					onClick={handleCanvasClick}
				></canvas>

				{/* 写信按钮 */}
				<button
					onClick={() => setIsComposing(true)}
					className='absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition-colors z-10'
					disabled={isReading || isComposing}
				>
					投放漂流瓶
				</button>

				<div className='absolute bottom-4 left-4 text-sm text-white bg-black bg-opacity-30 px-3 py-1 rounded-full'>
					点击漂流瓶阅读留言
				</div>

				{/* 阅读面板 */}
				<AnimatePresence>
					{isReading && currentMessage && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className='absolute inset-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 overflow-auto z-20'
						>
							<button
								onClick={() => setIsReading(false)}
								className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
							>
								✕
							</button>

							<div className='mb-8'>
								<div className='text-xl font-medium text-blue-600 dark:text-blue-400 mb-2'>
									来自{currentMessage.author ? ` ${currentMessage.author} ` : '匿名'}的漂流瓶
								</div>

								<p className='text-sm text-gray-500 dark:text-gray-400'>
									{new Date(currentMessage.createdAt).toLocaleDateString()}
								</p>
							</div>

							<div className='text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-6'>
								{currentMessage.text}
							</div>

							<div className='flex justify-center'>
								<button
									onClick={() => setIsReading(false)}
									className='px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors'
								>
									放回大海
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* 写信面板 */}
				<AnimatePresence>
					{isComposing && (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							className='absolute inset-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 overflow-auto z-20'
						>
							<button
								onClick={() => setIsComposing(false)}
								className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
							>
								✕
							</button>

							<h3 className='text-xl font-medium text-blue-600 dark:text-blue-400 mb-4'>
								写下你的留言
							</h3>

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
										你的名字 (可选)
									</label>
									<input
										type='text'
										value={authorName}
										onChange={(e) => setAuthorName(e.target.value)}
										className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
										placeholder='匿名'
										maxLength={20}
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
										留言内容
									</label>
									<textarea
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
										className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
										rows={5}
										placeholder='写下你想说的话...'
										maxLength={500}
									/>
								</div>

								<div className='text-right'>
									<button
										onClick={addMessage}
										disabled={!newMessage.trim()}
										className={`px-4 py-2 rounded-md ${
											newMessage.trim()
												? 'bg-blue-500 hover:bg-blue-600 text-white'
												: 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
										}`}
									>
										投放漂流瓶
									</button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* 成功提示 */}
				<AnimatePresence>
					{showSuccess && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg'
						>
							漂流瓶已投放到大海
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default DriftBottle
