import { Application, BitmapText, Container, Sprite, Text } from 'pixi.js'

export class Filters extends Container {
	constructor(app: Application) {
		super()

		const gasBtn = new Text('Gas', {
			fill: ['#ffffff'],
		})
		gasBtn.x = 0
		gasBtn.y = 0
		gasBtn.width = ITEM_SIZE
		gasBtn.height = ITEM_SIZE
		// @ts-ignore
		// gasBtn.interactive = true
		// @ts-ignore
		// gasBtn.on('pointerdown', this.onClick)

		this.addChild(gasBtn)
	}

	// onClick = () => {
	// 	console.log('=-= onClick')
	// }
}

const ITEM_SIZE = 50
