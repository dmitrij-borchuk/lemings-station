export class TaskManager {
	tasks: Task[] = []

	addTask(t: Task) {
		this.tasks.push(t)
	}

	getUnassignedTask() {
		return this.tasks.find((t) => !t.assignee)
	}

	getTasks() {
		return this.tasks
	}
}

export type Task = {
	assignee: string | null
	type: 'build'
}
