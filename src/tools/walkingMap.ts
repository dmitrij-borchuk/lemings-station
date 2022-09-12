import { GameObject, GameObjectType } from '../types/map'

export function makeWalkingMap(items: GameObject[]) {
	const walkingMap: WalkingMap = []
	items.forEach((el) => {
		const { x, y, type } = el
		walkingMap[x] = walkingMap[x] || []
		walkingMap[x][y] = getSpeedByType(walkingMap, el)
	})

	return walkingMap
}

function getSpeedByType(walkingMap: WalkingMap, el: GameObject) {
	const prevValue = (walkingMap[el.x] || [])[el.y]
	if (el.type === 'floor' && prevValue !== 0) {
		return 1
	}

	return 0
}

export function findEmptyPlace(walkingMap: WalkingMap) {
	const places: [number, number][] = []
	for (let x = 0; x < walkingMap.length; x++) {
		for (let y = 0; y < walkingMap[x].length; y++) {
			const element = walkingMap[x][y]
			if (element === 1) {
				places.push([x, y])
			}
		}
	}

	return places[Math.floor(Math.random() * places.length)]
}

export function findEmptyPlaceAround(
	walkingMap: WalkingMap,
	x: number,
	y: number
) {
	const result: [number, number][] = []
	for (let _x = x - 1; _x <= x + 1; _x++) {
		for (let _y = y - 1; _y <= y + 1; _y++) {
			const element = (walkingMap[_x] || [])[_y]
			if (element === 1) {
				result.push([_x, _y])
			}
		}
	}

	return result
}

export type WalkingMap = number[][]
