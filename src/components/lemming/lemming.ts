import { Application, Container, Sprite } from 'pixi.js'
import { BREATHING_FREQUENCY, TILE_SIZE } from '../../config'
import { Game } from '../../scenes/game'
import { Task } from '../../taskManager/taskManager'
import { CommonProps, Serializable } from '../../tools/serializable'
import { findEmptyPlaceAround } from '../../tools/walkingMap'

export class Lemming extends Container implements Serializable {
	hp = 100
	airConsumption = 400
	lastBreath = 0
	lastMove = 0
	speed = 500
	sprite: Sprite
	task?: Task

	constructor(private game: Game) {
		super()

		const sprite = Sprite.from('lemming')
		sprite.width = TILE_SIZE
		sprite.height = TILE_SIZE
		this.addChild(sprite)
		this.sprite = sprite
		// this.sprite.tint = 0xff0000
	}

	update(delta: number) {
		if (this.hp <= 0) {
			return
		}
		if (this.lastBreath + BREATHING_FREQUENCY < this.game.worldTime) {
			const gas = this.game.gasMap.find(
				(gas) => gas.x === this.x && gas.y === this.y
			)
			const air = gas?.content.air
			// const airVolume = air.reduce((acc, air) => acc + air.volume, 0)
			// console.log('=-= air', air)
			// console.log('=-= air.volume', air)
			// console.log('=-= airVolume', airVolume)
			if (!air || air < this.airConsumption) {
				this.hp -= 5
			}
			if (typeof gas?.content.air === 'number') {
				gas.setVolume(
					'air',
					Math.max(0, gas?.content.air - this.airConsumption)
				)
			}
			this.lastBreath = this.game.worldTime
		}

		this.hp = Math.max(0, this.hp)

		if (this.hp > 0 && this.game.worldTime - this.lastMove > this.speed) {
			this.task = this.game.taskManager.getUnassignedTask()
			if (!this.task) {
				this.moveToRandomPosition()
			}
			this.lastMove = this.game.worldTime
		}

		const hexString = Math.round((255 / 100) * this.hp)
			.toString(16)
			.padEnd(2, '0')
		const newTint = parseInt(`0xff${hexString}${hexString}`, 16)
		this.sprite.tint = newTint
	}

	moveToRandomPosition = () => {
		const places = findEmptyPlaceAround(
			this.game.walkingMap,
			this.x / TILE_SIZE,
			this.y / TILE_SIZE
		)
		if (places.length === 0) {
			// Can't move
			return
		}

		const index = Math.floor(Math.random() * places.length)
		const [x, y] = places[index]
		this.x = x * TILE_SIZE
		this.y = y * TILE_SIZE
	}

	getState(): State {
		return {
			x: this.x,
			y: this.y,
			hp: this.hp,
		}
	}

	setState(data: State) {
		this.x = data.x
		this.y = data.y
		this.hp = data.hp
	}
}

type State = CommonProps & {
	hp: number
}
