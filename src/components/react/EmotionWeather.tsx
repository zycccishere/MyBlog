import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type WeatherType = 'sunny' | 'rainy' | 'starry' | 'cloudy' | 'snowy'

interface WeatherInfo {
	type: WeatherType
	label: string
	emoji: string
	description: string
	color: string
}

interface EmotionWeatherProps {
	title?: string
	defaultWeather?: WeatherType
}

const EmotionWeather: React.FC<EmotionWeatherProps> = ({
	title = '今天的心情天气是...',
	defaultWeather = 'sunny'
}) => {
	const [weather, setWeather] = useState<WeatherType>(defaultWeather)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationRef = useRef<number>(0)

	const weatherTypes: Record<WeatherType, WeatherInfo> = {
		sunny: {
			type: 'sunny',
			label: '阳光灿烂',
			emoji: '☀️',
			description: '充满活力，满怀希望，就像阳光普照大地，温暖而明亮。',
			color: 'from-yellow-300 to-amber-500'
		},
		rainy: {
			type: 'rainy',
			label: '细雨绵绵',
			emoji: '🌧️',
			description: '感性而深沉，如细雨轻抚心灵，带来宁静与思念。',
			color: 'from-blue-300 to-indigo-500'
		},
		starry: {
			type: 'starry',
			label: '繁星点点',
			emoji: '✨',
			description: '浪漫而充满梦幻，像夜空中闪烁的星星，神秘而美丽。',
			color: 'from-violet-500 to-purple-900'
		},
		cloudy: {
			type: 'cloudy',
			label: '云淡风轻',
			emoji: '☁️',
			description: '平静而舒适，如轻柔的云朵，带来一丝宁静与惬意。',
			color: 'from-gray-300 to-slate-500'
		},
		snowy: {
			type: 'snowy',
			label: '雪花飘落',
			emoji: '❄️',
			description: '纯净而宁静，像雪花轻轻落下，带来安静与祥和。',
			color: 'from-sky-100 to-blue-200'
		}
	}

	// 绘制天气动画
	useEffect(() => {
		if (!canvasRef.current) return

		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		if (!context) return

		// 设置画布大小
		const setCanvasSize = () => {
			const { width, height } = canvas.getBoundingClientRect()
			canvas.width = width
			canvas.height = height
		}

		setCanvasSize()
		window.addEventListener('resize', setCanvasSize)

		// 绘制各种天气效果
		const particles: any[] = []

		// 创建粒子
		const createParticles = () => {
			particles.length = 0

			const count = canvas.width / 3 // 根据宽度动态生成粒子数量

			for (let i = 0; i < count; i++) {
				if (weather === 'rainy') {
					particles.push({
						x: Math.random() * canvas.width,
						y: Math.random() * canvas.height,
						length: Math.random() * 20 + 10,
						speed: Math.random() * 15 + 5,
						thickness: Math.random() * 2 + 1,
						opacity: Math.random() * 0.5 + 0.3
					})
				} else if (weather === 'sunny') {
					particles.push({
						x: canvas.width / 2,
						y: canvas.height / 3,
						radius: Math.random() * 3 + 1,
						angle: Math.random() * Math.PI * 2,
						distance: (Math.random() * canvas.width) / 4 + 50,
						speed: Math.random() * 0.01 + 0.005,
						opacity: Math.random() * 0.4 + 0.6
					})
				} else if (weather === 'starry') {
					particles.push({
						x: Math.random() * canvas.width,
						y: Math.random() * canvas.height,
						radius: Math.random() * 2 + 0.5,
						opacity: Math.random() * 0.8 + 0.2,
						twinkleSpeed: Math.random() * 0.02 + 0.01
					})
				} else if (weather === 'cloudy') {
					const cloudCount = 5
					if (i < cloudCount) {
						particles.push({
							x: Math.random() * canvas.width,
							y: Math.random() * (canvas.height / 2),
							radius: Math.random() * 60 + 40,
							speed: Math.random() * 0.2 + 0.1,
							opacity: Math.random() * 0.3 + 0.1
						})
					}
				} else if (weather === 'snowy') {
					particles.push({
						x: Math.random() * canvas.width,
						y: Math.random() * canvas.height,
						radius: Math.random() * 3 + 1,
						speed: Math.random() * 1 + 0.5,
						opacity: Math.random() * 0.6 + 0.4,
						wobble: Math.random() * 2
					})
				}
			}
		}

		createParticles()

		// 绘制动画
		const draw = () => {
			context.clearRect(0, 0, canvas.width, canvas.height)

			// 绘制不同天气的背景和效果
			if (weather === 'sunny') {
				// 阳光背景
				const gradient = context.createRadialGradient(
					canvas.width / 2,
					canvas.height / 3,
					10,
					canvas.width / 2,
					canvas.height / 3,
					canvas.width / 2
				)
				gradient.addColorStop(0, 'rgba(255, 200, 0, 0.8)')
				gradient.addColorStop(1, 'rgba(255, 160, 0, 0)')

				context.fillStyle = gradient
				context.fillRect(0, 0, canvas.width, canvas.height)

				// 太阳光线
				particles.forEach((particle) => {
					particle.angle += particle.speed

					const x1 = canvas.width / 2
					const y1 = canvas.height / 3
					const x2 = x1 + Math.cos(particle.angle) * particle.distance
					const y2 = y1 + Math.sin(particle.angle) * particle.distance

					context.beginPath()
					context.moveTo(x1, y1)
					context.lineTo(x2, y2)
					context.strokeStyle = `rgba(255, 255, 200, ${particle.opacity})`
					context.lineWidth = particle.radius
					context.stroke()
				})
			} else if (weather === 'rainy') {
				// 雨滴效果
				context.fillStyle = 'rgba(100, 100, 200, 0.1)'
				context.fillRect(0, 0, canvas.width, canvas.height)

				context.strokeStyle = 'rgba(180, 180, 255, 0.7)'
				context.lineWidth = 1

				particles.forEach((particle) => {
					particle.y += particle.speed
					if (particle.y > canvas.height) {
						particle.y = 0
						particle.x = Math.random() * canvas.width
					}

					context.beginPath()
					context.moveTo(particle.x, particle.y)
					context.lineTo(particle.x - particle.length * 0.2, particle.y + particle.length)
					context.strokeStyle = `rgba(180, 180, 255, ${particle.opacity})`
					context.lineWidth = particle.thickness
					context.stroke()
				})
			} else if (weather === 'starry') {
				// 星空效果
				context.fillStyle = 'rgba(20, 10, 50, 0.1)'
				context.fillRect(0, 0, canvas.width, canvas.height)

				particles.forEach((particle) => {
					// 闪烁效果
					particle.opacity = 0.2 + Math.abs(Math.sin(Date.now() * particle.twinkleSpeed)) * 0.8

					context.beginPath()
					context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
					context.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
					context.fill()
				})
			} else if (weather === 'cloudy') {
				// 云朵效果
				context.fillStyle = 'rgba(220, 220, 220, 0.05)'
				context.fillRect(0, 0, canvas.width, canvas.height)

				particles.forEach((particle) => {
					particle.x += particle.speed
					if (particle.x > canvas.width + particle.radius) {
						particle.x = -particle.radius
					}

					// 绘制云朵
					context.beginPath()
					context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
					context.arc(
						particle.x + particle.radius * 0.6,
						particle.y - particle.radius * 0.2,
						particle.radius * 0.7,
						0,
						Math.PI * 2
					)
					context.arc(
						particle.x - particle.radius * 0.6,
						particle.y - particle.radius * 0.2,
						particle.radius * 0.7,
						0,
						Math.PI * 2
					)
					context.arc(
						particle.x - particle.radius * 0.4,
						particle.y + particle.radius * 0.2,
						particle.radius * 0.7,
						0,
						Math.PI * 2
					)
					context.arc(
						particle.x + particle.radius * 0.4,
						particle.y + particle.radius * 0.2,
						particle.radius * 0.7,
						0,
						Math.PI * 2
					)

					context.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
					context.fill()
				})
			} else if (weather === 'snowy') {
				// 雪花效果
				context.fillStyle = 'rgba(230, 240, 255, 0.05)'
				context.fillRect(0, 0, canvas.width, canvas.height)

				particles.forEach((particle) => {
					particle.y += particle.speed
					// 左右摇摆
					particle.x += Math.sin(particle.y * 0.01) * particle.wobble

					if (particle.y > canvas.height) {
						particle.y = 0
						particle.x = Math.random() * canvas.width
					}

					context.beginPath()
					context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
					context.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
					context.fill()
				})
			}

			animationRef.current = requestAnimationFrame(draw)
		}

		draw()

		// 清理
		return () => {
			cancelAnimationFrame(animationRef.current)
			window.removeEventListener('resize', setCanvasSize)
		}
	}, [weather])

	const weatherInfo = weatherTypes[weather]

	return (
		<div className='my-10 mx-auto max-w-3xl'>
			<h2 className='text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200'>
				{title}
			</h2>

			<div className={`relative rounded-xl overflow-hidden shadow-lg`}>
				{/* 天气画布 */}
				<div className={`relative w-full h-64 bg-gradient-to-br ${weatherInfo.color}`}>
					<canvas ref={canvasRef} className='absolute inset-0 w-full h-full'></canvas>

					<div className='absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center'>
						<div className='text-5xl mb-2'>{weatherInfo.emoji}</div>
						<h3 className='text-2xl font-bold mb-2'>{weatherInfo.label}</h3>
						<p className='max-w-md'>{weatherInfo.description}</p>
					</div>
				</div>

				{/* 切换控制 */}
				<div className='flex justify-center p-4 bg-white dark:bg-gray-800'>
					{Object.values(weatherTypes).map((type) => (
						<button
							key={type.type}
							onClick={() => setWeather(type.type)}
							className={`mx-2 p-2 rounded-full text-xl transition-transform ${
								weather === type.type ? 'transform scale-125' : 'opacity-60 hover:opacity-90'
							}`}
							title={type.label}
						>
							{type.emoji}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default EmotionWeather
