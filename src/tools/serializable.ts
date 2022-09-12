export interface Serializable {
	getState: () => any
	setState: (data: any) => void
}

export interface CommonProps {
	x: number
	y: number
}
