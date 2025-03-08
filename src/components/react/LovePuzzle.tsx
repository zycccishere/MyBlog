import React, { useState, useEffect } from 'react'

// 定义拼图块接口
interface PuzzlePiece {
	id: number
	correctRow: number
	correctCol: number
	currentRow: number
	currentCol: number
}

interface LovePuzzleProps {
	image: string
	message?: string
	title?: string
	difficulty?: 'easy' | 'medium' | 'hard'
}

// 简化的组件，逐步添加功能
const LovePuzzle: React.FC<LovePuzzleProps> = ({
	image,
	message = '完成拼图，揭开我们的甜蜜秘密！',
	title = '爱的拼图',
	difficulty: initialDifficulty = 'medium'
}) => {
	const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty)

	// 计算网格大小
	const gridSize = currentDifficulty === 'easy' ? 3 : currentDifficulty === 'medium' ? 4 : 5

	const [imageLoaded, setImageLoaded] = useState(false)
	const [imageError, setImageError] = useState<string | null>(null)
	const [pieces, setPieces] = useState<PuzzlePiece[]>([])
	const [isComplete, setIsComplete] = useState(false)
	const [emptyCell, setEmptyCell] = useState({ row: gridSize - 1, col: gridSize - 1 })
	const [showHint, setShowHint] = useState(false)
	const [moveCount, setMoveCount] = useState(0)

	// 检查图片是否能加载
	useEffect(() => {
		if (!image) {
			setImageError('未提供图片URL')
			return
		}

		const img = new Image()
		img.onload = () => {
			setImageLoaded(true)
			setImageError(null)
		}
		img.onerror = () => {
			const errorMsg = `图片加载失败: ${image}`
			setImageError(errorMsg)
			setImageLoaded(false)
		}
		img.src = image

		return () => {
			img.onload = null
			img.onerror = null
		}
	}, [image])

	// 初始化拼图
	useEffect(() => {
		if (imageLoaded) {
			initializePuzzle()
		}
	}, [imageLoaded, gridSize])

	// 处理难度变更
	const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
		setCurrentDifficulty(newDifficulty)
	}

	// 初始化拼图逻辑
	const initializePuzzle = () => {
		// 创建拼图块数组
		const newPieces: PuzzlePiece[] = []

		// 生成有序拼图块
		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const id = row * gridSize + col

				// 最后一块是空白块，暂时不添加
				if (id === gridSize * gridSize - 1) continue

				newPieces.push({
					id,
					correctRow: row,
					correctCol: col,
					currentRow: row,
					currentCol: col
				})
			}
		}

		// 随机打乱拼图块位置
		for (let i = newPieces.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))

			const tempRow = newPieces[i].currentRow
			const tempCol = newPieces[i].currentCol

			newPieces[i].currentRow = newPieces[j].currentRow
			newPieces[i].currentCol = newPieces[j].currentCol

			newPieces[j].currentRow = tempRow
			newPieces[j].currentCol = tempCol
		}

		setPieces(newPieces)
		setEmptyCell({ row: gridSize - 1, col: gridSize - 1 })
		setIsComplete(false)
		setShowHint(false)
		setMoveCount(0)
	}

	// 检查拼图是否完成
	const checkCompletion = (updatedPieces: PuzzlePiece[]) => {
		const completed = updatedPieces.every(
			(piece) => piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol
		)

		if (completed) {
			setIsComplete(true)
		}

		return completed
	}

	// 处理拼图块点击
	const handlePieceClick = (piece: PuzzlePiece) => {
		if (isComplete) return

		const { currentRow, currentCol } = piece
		const { row: emptyRow, col: emptyCol } = emptyCell

		// 检查点击的拼图块是否与空白块相邻
		const isAdjacent =
			(currentRow === emptyRow && Math.abs(currentCol - emptyCol) === 1) ||
			(currentCol === emptyCol && Math.abs(currentRow - emptyRow) === 1)

		if (!isAdjacent) {
			return
		}

		// 更新拼图块位置
		const updatedPieces = pieces.map((p) => {
			if (p.id === piece.id) {
				return { ...p, currentRow: emptyRow, currentCol: emptyCol }
			}
			return p
		})

		setPieces(updatedPieces)
		setEmptyCell({ row: currentRow, col: currentCol })
		setMoveCount(moveCount + 1)

		// 检查是否完成
		checkCompletion(updatedPieces)
	}

	return (
		<div style={{ margin: '48px auto', maxWidth: '400px' }}>
			<h2
				style={{
					fontSize: '24px',
					fontWeight: 'bold',
					textAlign: 'center',
					marginBottom: '16px',
					color: '#db2777'
				}}
			>
				{title}
			</h2>

			{imageError && (
				<div
					style={{
						padding: '8px',
						marginBottom: '16px',
						backgroundColor: '#fee2e2',
						borderRadius: '4px',
						color: '#b91c1c'
					}}
				>
					<p>图片加载错误: {imageError}</p>
				</div>
			)}

			{!imageLoaded && !imageError && (
				<div
					style={{
						padding: '8px',
						marginBottom: '16px',
						backgroundColor: '#e0f2fe',
						borderRadius: '4px',
						color: '#0369a1'
					}}
				>
					<p>正在加载图片...</p>
				</div>
			)}

			{/* 游戏统计 */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '12px',
					padding: '8px',
					backgroundColor: '#f3f4f6',
					borderRadius: '4px'
				}}
			>
				<div>
					<span style={{ fontWeight: 'bold' }}>难度:</span>{' '}
					{currentDifficulty === 'easy' ? '简单' : currentDifficulty === 'medium' ? '中等' : '困难'}
				</div>
				<div>
					<span style={{ fontWeight: 'bold' }}>移动次数:</span> {moveCount}
				</div>
			</div>

			{/* 游戏区域 */}
			<div
				style={{
					position: 'relative',
					width: '100%',
					paddingBottom: '100%', // 保持正方形
					margin: '0 auto',
					backgroundColor: '#f3f4f6',
					overflow: 'hidden',
					borderRadius: '8px',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
				}}
			>
				{/* 原图提示 */}
				{showHint && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(255, 255, 255, 0.9)',
							zIndex: 10,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '16px'
						}}
					>
						<img
							src={image}
							alt='完整图片'
							style={{
								maxWidth: '90%',
								maxHeight: '70%',
								marginBottom: '16px',
								border: '2px solid #e5e7eb',
								borderRadius: '4px'
							}}
						/>
						<button
							onClick={() => setShowHint(false)}
							style={{
								padding: '4px 12px',
								backgroundColor: '#f9a8d4',
								borderRadius: '16px',
								border: 'none',
								cursor: 'pointer'
							}}
						>
							返回游戏
						</button>
					</div>
				)}

				{/* 渲染拼图块 */}
				{pieces.map((piece) => (
					<div
						key={piece.id}
						onClick={() => handlePieceClick(piece)}
						style={{
							position: 'absolute',
							top: `${(piece.currentRow * 100) / gridSize}%`,
							left: `${(piece.currentCol * 100) / gridSize}%`,
							width: `${100 / gridSize}%`,
							height: `${100 / gridSize}%`,
							backgroundImage: `url(${image})`,
							backgroundSize: `${gridSize * 100}%`,
							backgroundPosition: `-${piece.correctCol * 100}% -${piece.correctRow * 100}%`,
							border: '2px solid white',
							boxSizing: 'border-box',
							transition: 'all 0.2s ease',
							cursor: 'pointer',
							zIndex: 1
						}}
					/>
				))}

				{/* 成功消息 */}
				{isComplete && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(0, 0, 0, 0.7)',
							zIndex: 20,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '16px'
						}}
					>
						<div
							style={{
								backgroundColor: 'white',
								padding: '20px',
								borderRadius: '8px',
								maxWidth: '80%',
								textAlign: 'center'
							}}
						>
							<h3
								style={{
									fontSize: '20px',
									fontWeight: 'bold',
									marginBottom: '12px',
									color: '#db2777'
								}}
							>
								恭喜你完成了拼图！
							</h3>
							<p style={{ marginBottom: '8px' }}>完成移动次数: {moveCount}</p>
							<p style={{ marginBottom: '16px' }}>{message}</p>
							<button
								onClick={initializePuzzle}
								style={{
									padding: '8px 16px',
									backgroundColor: '#db2777',
									color: 'white',
									borderRadius: '20px',
									border: 'none',
									cursor: 'pointer'
								}}
							>
								再玩一次
							</button>
						</div>
					</div>
				)}
			</div>

			{/* 控制按钮 */}
			<div
				style={{
					marginTop: '16px',
					display: 'flex',
					justifyContent: 'center',
					flexWrap: 'wrap',
					gap: '8px'
				}}
			>
				<button
					onClick={() => setShowHint(true)}
					disabled={isComplete}
					style={{
						padding: '4px 12px',
						backgroundColor: isComplete ? '#e5e7eb' : '#f9a8d4',
						color: isComplete ? '#9ca3af' : '#000',
						borderRadius: '16px',
						border: 'none',
						cursor: isComplete ? 'not-allowed' : 'pointer'
					}}
				>
					查看提示
				</button>

				<button
					onClick={initializePuzzle}
					style={{
						padding: '4px 12px',
						backgroundColor: '#e5e7eb',
						borderRadius: '16px',
						border: 'none',
						cursor: 'pointer'
					}}
				>
					重置拼图
				</button>

				<select
					value={currentDifficulty}
					onChange={(e) => handleDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}
					style={{
						padding: '4px 12px',
						backgroundColor: 'white',
						borderRadius: '16px',
						border: '1px solid #e5e7eb',
						cursor: 'pointer'
					}}
				>
					<option value='easy'>简单 (3x3)</option>
					<option value='medium'>中等 (4x4)</option>
					<option value='hard'>困难 (5x5)</option>
				</select>
			</div>
		</div>
	)
}

export default LovePuzzle
