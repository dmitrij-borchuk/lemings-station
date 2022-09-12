import { Sprite } from 'pixi.js'

export type GameMap = {
	items: GameObject[]
}

export type GameObject = {
	x: number
	y: number
	type: GameObjectType
	sprite?: Sprite
}

export type GameObjectType = 'floor' | 'wall' | 'baseCloner' | 'lemming'
