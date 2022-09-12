import { GameMap, GameObject } from '../types/map'

export function getSimpleMap(): GameMap {
	const w = 7
	const h = 7
	return {
		items: [
			...makeRect(
				w,
				h,
				{ type: 'floor' },
				{
					fill: true,
				}
			),
			...makeRect(
				w,
				h,
				{ type: 'wall' },
				{
					fill: false,
				}
			),
			{
				x: Math.floor(w / 2),
				y: Math.floor(h / 2),
				type: 'baseCloner',
			},
		],
	}
}

function makeRect(
	w: number,
	h: number,
	obj: Omit<GameObject, 'x' | 'y'>,
	options?: {
		xStart?: number
		yStart?: number
		fill?: boolean
	}
) {
	const { fill = false, xStart = 0, yStart = 0 } = options || {}
	const items: GameObject[] = []
	for (let x = 0; x < w; x++) {
		for (let y = 0; y < h; y++) {
			if (!fill && !isEdge(x, y, w, h)) {
				continue
			}
			items.push({
				...obj,
				x: x + xStart,
				y: y + yStart,
			})
		}
	}

	return items
}

function isEdge(x: number, y: number, w: number, h: number) {
	return x === 0 || x === w - 1 || y === 0 || y === h - 1
}
