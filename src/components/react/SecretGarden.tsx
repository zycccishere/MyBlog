import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SecretItem {
	id: string
	x: number
	y: number
	title: string
	description: string
	icon: string
	color: string
}

interface SecretGardenProps {
	title?: string
	items?: SecretItem[]
	backgroundImage?: string
}

const SecretGarden: React.FC<SecretGardenProps> = ({
	title = '我们的秘密花园',
	items = [
		{
			id: 'first-date',
			x: 20,
			y: 30,
			title: '初次相遇',
			description: '那是个阳光明媚的下午，我们在咖啡馆偶然相遇...',
			icon: '☕',
			color: 'bg-amber-100 dark:bg-amber-900'
		},
		{
			id: 'proposal',
			x: 70,
			y: 60,
			title: '浪漫求婚',
			description: '在星空下，我单膝跪地，向你求婚...',
			icon: '💍',
			color: 'bg-pink-100 dark:bg-pink-900'
		},
		{
			id: 'trip',
			x: 40,
			y: 80,
			title: '第一次旅行',
			description: '我们一起去了海边，看日出日落，留下美好回忆...',
			icon: '🏝️',
			color: 'bg-blue-100 dark:bg-blue-900'
		},
		{
			id: 'secret',
			x: 85,
			y: 20,
			title: '小秘密',
			description: '只有我们两个人知道的小秘密...',
			icon: '🤫',
			color: 'bg-purple-100 dark:bg-purple-900'
		},
		{
			id: 'anniversary',
			x: 55,
			y: 40,
			title: '周年纪念',
			description: '每一年的这一天，我们都会庆祝我们的相识...',
			icon: '🎂',
			color: 'bg-red-100 dark:bg-red-900'
		}
	],
	backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d1fae5' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
}) => {
	const [selectedItem, setSelectedItem] = useState<SecretItem | null>(null)
	const [discoveredItems, setDiscoveredItems] = useState<string[]>([])
	const [showHint, setShowHint] = useState(false)

	const handleItemClick = (item: SecretItem) => {
		setSelectedItem(item)
		if (!discoveredItems.includes(item.id)) {
			setDiscoveredItems((prev) => [...prev, item.id])
		}
	}

	const closeDetail = () => {
		setSelectedItem(null)
	}

	return (
		<div className='my-12 mx-auto max-w-4xl'>
			<h2 className='text-2xl font-bold text-center mb-6 text-emerald-600 dark:text-emerald-400'>
				{title}
			</h2>

			<div className='relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
				{/* 进度指示器 */}
				<div className='absolute top-4 right-4 z-20 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-sm shadow-md'>
					发现 {discoveredItems.length}/{items.length}
				</div>

				{/* 提示按钮 */}
				<button
					onClick={() => setShowHint(!showHint)}
					className='absolute top-4 left-4 z-20 bg-white dark:bg-gray-900 w-8 h-8 rounded-full flex items-center justify-center shadow-md text-emerald-600 dark:text-emerald-400'
				>
					{showHint ? '×' : '?'}
				</button>

				{/* 花园地图 */}
				<div
					className='relative w-full aspect-[4/3] overflow-hidden'
					style={{ background: backgroundImage }}
				>
					{/* 装饰元素 */}
					<div className='absolute bottom-4 left-10 text-4xl'>🌳</div>
					<div className='absolute top-10 right-16 text-3xl'>🌸</div>
					<div className='absolute top-1/3 left-1/4 text-3xl'>🌻</div>
					<div className='absolute bottom-1/4 right-1/3 text-3xl'>🌷</div>
					<div className='absolute top-2/3 left-2/3 text-2xl'>🦋</div>

					{/* 秘密点 */}
					{items.map((item) => {
						const isDiscovered = discoveredItems.includes(item.id)

						return (
							<motion.div
								key={item.id}
								className={`absolute cursor-pointer ${
									showHint && !isDiscovered ? 'animate-pulse' : ''
								}`}
								style={{
									left: `${item.x}%`,
									top: `${item.y}%`,
									transform: 'translate(-50%, -50%)'
								}}
								onClick={() => handleItemClick(item)}
								whileHover={{ scale: 1.2 }}
								whileTap={{ scale: 0.9 }}
							>
								<div
									className={`
                  w-12 h-12 rounded-full ${item.color} flex items-center justify-center 
                  text-2xl shadow-md relative
                  ${isDiscovered ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
                `}
								>
									{item.icon}

									{/* 发现标记 */}
									{isDiscovered && (
										<div className='absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-white text-xs flex items-center justify-center'>
											✓
										</div>
									)}
								</div>
							</motion.div>
						)
					})}
				</div>

				{/* 详情面板 */}
				<AnimatePresence>
					{selectedItem && (
						<motion.div
							className='absolute inset-0 bg-black bg-opacity-60 z-30 flex items-center justify-center p-6'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={closeDetail}
						>
							<motion.div
								className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md'
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.8, opacity: 0 }}
								onClick={(e) => e.stopPropagation()}
							>
								<div className='flex items-center mb-4'>
									<div
										className={`w-12 h-12 ${selectedItem.color} rounded-full flex items-center justify-center text-2xl mr-4`}
									>
										{selectedItem.icon}
									</div>
									<h3 className='text-xl font-bold text-gray-800 dark:text-gray-200'>
										{selectedItem.title}
									</h3>
								</div>

								<p className='text-gray-600 dark:text-gray-300 mb-6'>{selectedItem.description}</p>

								<div className='text-right'>
									<button
										onClick={closeDetail}
										className='px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800'
									>
										返回花园
									</button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* 全部发现的祝贺消息 */}
				<AnimatePresence>
					{discoveredItems.length === items.length && !selectedItem && (
						<motion.div
							className='absolute inset-0 bg-black bg-opacity-60 z-20 flex items-center justify-center p-6'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								className='bg-white dark:bg-gray-800 p-6 rounded-lg text-center max-w-md'
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.8, opacity: 0 }}
							>
								<div className='text-5xl mb-4'>🎉</div>
								<h3 className='text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3'>
									你发现了所有秘密！
								</h3>
								<p className='text-gray-600 dark:text-gray-300 mb-6'>
									我们的故事如同这座花园，每一处都有值得珍藏的回忆。感谢你与我共同探索这段美好旅程。
								</p>
								<button
									onClick={() => setDiscoveredItems([])}
									className='px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800'
								>
									重新探索
								</button>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default SecretGarden
