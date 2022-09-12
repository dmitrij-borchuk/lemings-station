import { Application, Container, Sprite } from 'pixi.js'

export class Toolbar extends Container {
	constructor(app: Application) {
		super()

		const sprite = new Sprite(app.loader.resources['deleteIcon'].texture)
		// const sprite = Sprite.from('deleteIcon')
		sprite.x = 0
		sprite.y = 0
		sprite.width = ITEM_SIZE
		sprite.height = ITEM_SIZE
		// @ts-ignore
		sprite.interactive = true
		// @ts-ignore
		sprite.on('pointerdown', this.onClick)

		this.addChild(sprite)

		app.ticker.add(this.update)
	}

	onClick = () => {
		console.log('=-= onClick')
	}

	update = (delta: number) => {}
}

const ITEM_SIZE = 50
