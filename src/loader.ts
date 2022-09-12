import { Application } from 'pixi.js'

export function loadImages(app: Application) {
	return new Promise<void>((resolve) => {
		app.loader.add('floor', 'assets/floor.png')
		app.loader.add('wall', 'assets/wall.png')
		app.loader.add('lemming', 'assets/lemming.png')
		app.loader.add('baseCloner', 'assets/baseCloner.png')
		app.loader.add('deleteIcon', 'assets/deleteIcon.png')
		app.loader.load(() => {
			resolve()
		})
	})
}
