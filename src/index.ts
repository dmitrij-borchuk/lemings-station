import * as PIXI from 'pixi.js'
import { HelloWorld } from './scenes/helloWorld'
import { Game } from './scenes/game'
import { loadImages } from './loader'

const main = async () => {
	// Main app
	let app = new PIXI.Application()

	// Display application properly
	document.body.style.margin = '0'
	app.renderer.view.style.position = 'absolute'
	app.renderer.view.style.display = 'block'

	// View size = windows
	app.renderer.resize(window.innerWidth, window.innerHeight)
	window.addEventListener('resize', (e) => {
		app.renderer.resize(window.innerWidth, window.innerHeight)
	})

	// Load assets
	await loadImages(app)
	document.body.appendChild(app.view)

	// var scene = new HelloWorld(app)
	// Set scene
	var scene = new Game(app)
	scene.sortableChildren = true
	app.stage.addChild(scene)
}

main()
