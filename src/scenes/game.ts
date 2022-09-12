import { Application, Container, Sprite } from 'pixi.js'
import { Filters } from '../components/filters'
import { Air } from '../components/gas/air'
import { Gas } from '../components/gas/gas'
import { Lemming } from '../components/lemming/lemming'
import { Toolbar } from '../components/toolbar'
import { TILE_SIZE } from '../config'
import { getSimpleMap } from '../generator/simple'
import { TaskManager } from '../taskManager/taskManager'
import {
	findEmptyPlace,
	findEmptyPlaceAround,
	makeWalkingMap,
	WalkingMap,
} from '../tools/walkingMap'
import { GameMap, GameObject } from '../types/map'

export class Game extends Container {
	// app: Application
	// sprite: Sprite
	// state: { velocity: { x: number; y: number } }
	map: GameMap
	world: Container
	walkingMap: WalkingMap
	lemmingSpeed = 1000
	camera = {
		x: 0,
		y: 0,
	}
	worldTime = 0
	lastUpdate: Date
	lemmings: Lemming[] = []
	// gasMap: GasMap = []
	gasMap: Gas[] = []
	taskManager: TaskManager
	gasHighlighter: Container
	lastGasMovie: number = 0

	constructor(private app: Application) {
		super()

		// Generate map
		this.map = getSimpleMap()

		this.world = new Container()
		this.addChild(this.world)
		// Find base
		const base = this.map.items.find((el) => el.type === 'baseCloner')
		if (base) {
			this.camera.x = base.x * TILE_SIZE + TILE_SIZE / 2
			this.camera.y = base.y * TILE_SIZE + TILE_SIZE / 2
		}
		this.world.x = window.innerWidth / 2 - this.camera.x
		this.world.y = window.innerHeight / 2 - this.camera.y

		// Generate walking map
		this.walkingMap = makeWalkingMap(this.map.items)

		this.map.items.forEach((el) => {
			const sprite = new Sprite(app.loader.resources[el.type].texture)
			sprite.zIndex = el.type === 'floor' ? 0 : 1
			sprite.x = el.x * TILE_SIZE
			sprite.y = el.y * TILE_SIZE
			sprite.width = TILE_SIZE
			sprite.height = TILE_SIZE
			this.world.addChild(sprite)
			el.sprite = sprite
		})

		// Add Lemmings
		this.addLemming()
		// this.addLemming()
		// this.addLemming()

		// Lemmings should remove walls
		// Lemmings should build walls
		// Camera should move

		// Toolbar
		const toolbar = new Toolbar(app)
		toolbar.x = window.innerWidth - toolbar.width
		toolbar.y = window.innerHeight - toolbar.height
		// toolbar.y = this.camera.y
		toolbar.zIndex = 10
		this.addChild(toolbar)

		const filters = new Filters(app)
		filters.zIndex = 10
		this.addChild(filters)
		// @ts-ignore
		filters.interactive = true
		// @ts-ignore
		filters.on('pointerdown', () => {
			this.gasHighlighter.renderable = !this.gasHighlighter.renderable
		})

		// this.app = app
		// this.state = { velocity: { x: 1, y: 1 } }
		// this.update = this.update.bind(this)

		// this.sprite = new Sprite(
		// 	app.loader.resources['assets/hello-world.png'].texture
		// )
		// this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2
		// this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2
		// this.addChild(this.sprite)

		// // Handle window resizing
		// window.addEventListener('resize', (e) => {
		// 	this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2
		// 	this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2
		// })

		// // Handle update
		app.ticker.add(this.update)
		this.lastUpdate = new Date()

		this.taskManager = new TaskManager()

		// Gas highlighter
		this.gasHighlighter = new Container()
		this.world.addChild(this.gasHighlighter)
		this.gasHighlighter.renderable = false
		this.addAir()
	}

	update = (delta: number) => {
		const now = new Date()
		const msDelta = now.getTime() - this.lastUpdate.getTime()
		this.lastUpdate = now
		this.worldTime += msDelta

		this.lemmings.forEach((lemming) => lemming.update(msDelta))

		const aliveLemming = this.lemmings.find((l) => l.hp > 0)
		if (this.lastGasMovie + 500 < this.worldTime) {
			this.moveGases()
			this.lastGasMovie = this.worldTime
		}

		if (!aliveLemming) {
			console.log('!!!!!!!!!!!!!! Game over')
		}
	}

	addLemming = () => {
		const emptyPlace = findEmptyPlace(this.walkingMap)
		if (!emptyPlace) {
			throw new Error('No empty place found for the walking map')
		}
		const [emptyX, emptyY] = emptyPlace

		const lemming = new Lemming(this)
		lemming.x = emptyX * TILE_SIZE
		lemming.y = emptyY * TILE_SIZE
		this.world.addChild(lemming)
		this.lemmings.push(lemming)
		// this.map.items.push({
		// 	type: 'lemming',
		// 	x: emptyX,
		// 	y: emptyY,
		// })
	}

	addAir() {
		this.walkingMap.map((col, x) => {
			col.map((v, y) => {
				if (v === 1) {
					const air = new Gas()
					air.x = x * TILE_SIZE
					air.y = y * TILE_SIZE
					air.setVolume('air', 1200)
					this.gasMap.push(air)
				}
			})
		})
		this.gasHighlighter.addChild(...this.gasMap)
	}

	moveGases() {
		const map = this.gasMap.reduce<Record<string, Gas>>((acc, curr) => {
			acc[`${curr.x}:${curr.y}`] = curr
			return acc
		}, {})
		// TODO: all gases
		this.gasMap.forEach((g, i) => {
			// const previous = this.gasMap[i - 1]?.content.air
			// const next = this.gasMap[i + 1]?.content.air
			// const curr = g?.content.air
			// if (typeof curr !== 'number') {
			// 	return
			// }
			// if (typeof previous === 'number' && previous < curr) {
			// 	const diff = Math.round((curr - previous) / 2)
			// 	this.gasMap[i - 1].setVolume('air', previous + diff)
			// 	g.setVolume('air', curr - diff)
			// }
			// if (typeof next === 'number' && next < curr) {
			// 	const diff = Math.round((curr - next) / 2)
			// 	this.gasMap[i + 1].setVolume('air', next + diff)
			// 	g.setVolume('air', curr - diff)
			// }
			const siblings = [
				map[`${g.x - TILE_SIZE}:${g.y}`],
				map[`${g.x + TILE_SIZE}:${g.y}`],
				map[`${g.x}:${g.y - TILE_SIZE}`],
				map[`${g.x}:${g.y + TILE_SIZE}`],
			].filter((el) => !!el)

			if (siblings.length === 0) {
				return
			}
			const sum =
				siblings.reduce<number>((acc, cur) => acc + (cur.content.air || 0), 0) +
				(g.content.air || 0)
			const final = sum / (siblings.length + 1)

			siblings.forEach((el) => {
				el.setVolume('air', final)
			})
			g.setVolume('air', final)
			if (i === 6) {
				console.log('=-= sum', sum)
				console.log('=-= final', final)
			}
		})
		console.log('=-= air[0]', this.gasMap[0].content.air)
	}
}
