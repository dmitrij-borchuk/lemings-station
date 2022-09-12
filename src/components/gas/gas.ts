import { Application, Graphics, Sprite } from 'pixi.js'
import { TILE_SIZE } from '../../config'

export class Gas extends Graphics {
	content: GasMap = {}
	constructor() {
		super()
	}

	setVolume(gas: GasType, volume: number) {
		this.content[gas] = volume
		this.update()
	}

	update() {
		this.clear()
		const primary = Object.entries(this.content)
			.map(([key, value]) => ({ key, value }))
			.reduce((max, curr) => (max.value > curr.value ? max : curr))
		// const color = GAS_TO_COLOR[primary.key] || {
		// 	max: 0x000000,
		// 	min: 0x000000,
		// }
		const current = gasToColor(primary.key, primary.value)
		this.beginFill(current, 0.7)
		this.drawRect(0, 0, TILE_SIZE, TILE_SIZE)
		this.endFill()
	}
}

function gasToColor(name: string, value: number) {
	if (name === 'air') {
		const brightness = 35 + ((85 - 35) / 1200) * Math.min(value, 1200)
		return hslToHex(213, 61, brightness)
	}

	return 0x000000
}
const GAS_TO_COLOR: Record<string, { min: number; max: number }> = {
	air: {
		max: 0xb4ceed,
		min: 0x184478,
	},
}

type GasType = 'air'
type GasMap = Partial<Record<GasType, number>>

function hslToHex(h: number, s: number, l: number) {
	l /= 100
	const a = (s * Math.min(l, 1 - l)) / 100
	const f = (n: number) => {
		const k = (n + h / 30) % 12
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0') // convert to Hex and prefix "0" if needed
	}
	return parseInt(`${f(0)}${f(8)}${f(4)}`, 16)
	// return `#${f(0)}${f(8)}${f(4)}`;
}
