import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeartbeatSyncProps {
	title?: string
	secretMessage?: string
	secretBpm?: number
	tolerance?: number
}

const HeartbeatSync: React.FC<HeartbeatSyncProps> = ({
	title = '寻找我们的心跳频率',
	secretMessage = '我们的心跳频率一致，就像命中注定的缘分。',
	secretBpm = 80, // 默认目标BPM
	tolerance = 5 // 允许的误差范围
}) => {
	const [bpm, setBpm] = useState(60)
	const [isBeating, setIsBeating] = useState(false)
	const [beatCount, setBeatCount] = useState(0)
	const [showSecret, setShowSecret] = useState(false)
	const [isSynced, setIsSynced] = useState(false)
	const [pulsing, setPulsing] = useState(false)

	const beatsRef = useRef<number[]>([])
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	// 初始化音频
	useEffect(() => {
		audioRef.current = new Audio(
			'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAYIAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dP//////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQAAAAAAAAAAAGCwcC0XwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAAACwAAAAEluZm8AAAAPAAAAAwAAAYIAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dP//////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQAAAAAAAAAAAGCHxUg4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxA8NAAEIAAAAAP7jl0oA4XH////////////////w/UDiEf/AP//p///////////w/+V///4f////////////////+/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxCoR0xG0AQEAA////////////////+H//4AAw//+/4f//+H//4AAwAAAAP///+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwA'
		)

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		}
	}, [])

	// 心跳动画
	useEffect(() => {
		if (isBeating) {
			const interval = 60000 / bpm // 毫秒每拍
			const pulseInterval = setInterval(() => {
				setPulsing(true)
				setTimeout(() => setPulsing(false), 150)

				// 播放音效
				if (audioRef.current) {
					audioRef.current.currentTime = 0
					audioRef.current.play().catch(() => {
						// 处理可能的自动播放限制
					})
				}
			}, interval)

			return () => clearInterval(pulseInterval)
		}
	}, [isBeating, bpm])

	// 手动点击心跳
	const handleBeat = () => {
		const now = Date.now()
		beatsRef.current.push(now)

		// 只保留最近10次点击
		if (beatsRef.current.length > 10) {
			beatsRef.current.shift()
		}

		setBeatCount((prev) => prev + 1)

		// 至少需要2次点击才能计算BPM
		if (beatsRef.current.length >= 2) {
			calculateBPM()
		}

		// 播放音效
		if (audioRef.current) {
			audioRef.current.currentTime = 0
			audioRef.current.play().catch(() => {
				// 处理可能的自动播放限制
			})
		}

		// 心跳动画
		setPulsing(true)
		setTimeout(() => setPulsing(false), 150)

		// 检查是否与秘密BPM同步
		checkSync()
	}

	// 计算BPM
	const calculateBPM = () => {
		const beats = beatsRef.current
		const intervals = []

		for (let i = 1; i < beats.length; i++) {
			intervals.push(beats[i] - beats[i - 1])
		}

		const averageInterval =
			intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
		const calculatedBPM = Math.round(60000 / averageInterval)

		// 限制在合理范围内 (30-200 BPM)
		const limitedBPM = Math.max(30, Math.min(200, calculatedBPM))
		setBpm(limitedBPM)
	}

	// 检查是否与秘密频率同步
	const checkSync = () => {
		if (Math.abs(bpm - secretBpm) <= tolerance) {
			if (!isSynced) {
				setIsSynced(true)

				// 连续同步3秒后显示秘密消息
				timerRef.current = setTimeout(() => {
					setShowSecret(true)
				}, 3000)
			}
		} else {
			setIsSynced(false)
			if (timerRef.current) {
				clearTimeout(timerRef.current)
				timerRef.current = null
			}
		}
	}

	// 自动心跳开关
	const toggleBeating = () => {
		setIsBeating(!isBeating)
		// 重置手动心跳数据
		beatsRef.current = []
		setBeatCount(0)
	}

	return (
		<div className='my-12 mx-auto max-w-lg'>
			<h2 className='text-2xl font-bold text-center mb-6 text-red-600 dark:text-red-400'>
				{title}
			</h2>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative overflow-hidden'>
				{/* 背景心电图效果 */}
				<div className='absolute inset-0 overflow-hidden opacity-10'>
					<svg width='100%' height='100%' viewBox='0 0 1000 100' preserveAspectRatio='none'>
						<motion.path
							d='M0,50 Q25,50 50,50 T100,50 150,50 200,50 250,50 300,10 350,90 400,50 450,50 500,50 550,50 600,50 650,50 700,50 750,50 800,10 850,90 900,50 950,50 1000,50'
							stroke='currentColor'
							strokeWidth='2'
							fill='none'
							className='text-red-500'
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{
								pathLength: 1,
								opacity: 1,
								x: [0, -1000]
							}}
							transition={{
								duration: 10,
								repeat: Infinity,
								ease: 'linear'
							}}
						/>
					</svg>
				</div>

				<div className='relative z-10'>
					{/* 心跳显示区域 */}
					<div className='flex justify-center'>
						<motion.div
							className='w-40 h-40 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center cursor-pointer'
							whileTap={{ scale: 0.95 }}
							onClick={handleBeat}
							animate={{
								scale: pulsing ? [1, 1.15, 1] : 1,
								boxShadow: pulsing
									? [
											'0 0 0 0 rgba(239, 68, 68, 0)',
											'0 0 0 20px rgba(239, 68, 68, 0.3)',
											'0 0 0 40px rgba(239, 68, 68, 0)'
										]
									: '0 0 0 0 rgba(239, 68, 68, 0)'
							}}
							transition={{ duration: 0.5, times: [0, 0.2, 1] }}
						>
							<div className='text-red-600 dark:text-red-400'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='currentColor'
									className='w-16 h-16'
								>
									<path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
								</svg>
							</div>
						</motion.div>
					</div>

					{/* 心率信息 */}
					<div className='mt-6 text-center'>
						<p className='text-xl font-bold text-red-600 dark:text-red-400'>
							{bpm} <span className='text-sm font-normal'>BPM</span>
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
							{beatCount === 0 ? '点击心形以开始' : `已点击 ${beatCount} 次`}
						</p>
					</div>

					{/* 控制区域 */}
					<div className='mt-6 flex justify-center space-x-4'>
						<div className='flex items-center space-x-2'>
							<button
								onClick={() => setBpm(Math.max(30, bpm - 5))}
								className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
							>
								-
							</button>

							<div className='flex flex-col items-center'>
								<input
									type='range'
									min='30'
									max='200'
									value={bpm}
									onChange={(e) => setBpm(parseInt(e.target.value))}
									className='w-32 accent-red-500'
								/>
								<span className='text-xs text-gray-500 dark:text-gray-400 mt-1'>调整BPM</span>
							</div>

							<button
								onClick={() => setBpm(Math.min(200, bpm + 5))}
								className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
							>
								+
							</button>
						</div>

						<button
							onClick={toggleBeating}
							className={`px-4 py-1 rounded-full text-sm ${
								isBeating
									? 'bg-red-500 text-white hover:bg-red-600'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
							}`}
						>
							{isBeating ? '停止' : '自动心跳'}
						</button>
					</div>

					{/* 同步指示器 */}
					{isSynced && (
						<div className='mt-4 text-center'>
							<motion.div
								className='inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-sm'
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
							>
								心跳同步中...{' '}
								{showSecret ? '✓' : <span className='inline-block animate-pulse'>•••</span>}
							</motion.div>
						</div>
					)}

					{/* 秘密消息 */}
					<AnimatePresence>
						{showSecret && (
							<motion.div
								className='mt-6 p-4 bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 rounded-lg text-center'
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<p className='text-lg font-medium text-pink-700 dark:text-pink-300'>
									{secretMessage}
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	)
}

export default HeartbeatSync
