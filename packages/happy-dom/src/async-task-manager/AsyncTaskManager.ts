/**
 * Handles async tasks.
 */
export default class AsyncTaskManager {
	private static taskID = 0;
	private runningTasks: number[] = [];
	private runningTimers: NodeJS.Timeout[] = [];
	private queue: { resolve: () => void; reject: (error: Error) => void }[] = [];

	/**
	 * Returns a promise that is fulfilled when async tasks are complete.
	 * This method is not part of the HTML standard.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		return new Promise((resolve, reject) => {
			const timerID = global.setTimeout(() => {
				this.endTimer(timerID);
			}, 0);
			this.startTimer(timerID);
			this.queue.push({ resolve, reject });
		});
	}

	/**
	 * Cancels all tasks.
	 *
	 * @param [error] Error.
	 */
	public cancelAll(error?: Error): void {
		for (const timerID of this.runningTimers) {
			global.clearTimeout(timerID);
		}

		const promises = this.queue;

		this.runningTasks = [];
		this.runningTimers = [];
		this.queue = [];

		for (const promise of promises) {
			if (error) {
				promise.reject(error);
			} else {
				promise.resolve();
			}
		}
	}

	/**
	 * Starts a timer.
	 *
	 * @param timerID Timer ID.
	 */
	public startTimer(timerID: NodeJS.Timeout): void {
		this.runningTimers.push(timerID);
	}

	/**
	 * Ends a timer.
	 *
	 * @param timerID Timer ID.
	 */
	public endTimer(timerID: NodeJS.Timeout): void {
		const index = this.runningTimers.indexOf(timerID);
		if (index !== -1) {
			this.runningTimers.splice(index, 1);
		}
		if (!this.runningTasks.length && !this.runningTimers.length) {
			this.cancelAll();
		}
	}

	/**
	 * Starts an async task.
	 *
	 * @returns Task ID.
	 */
	public startTask(): number {
		const taskID = this.newTaskID();
		this.runningTasks.push(taskID);
		return taskID;
	}

	/**
	 * Ends an async task.
	 *
	 * @param taskID Task ID.
	 */
	public endTask(taskID: number): void {
		const index = this.runningTasks.indexOf(taskID);
		if (index !== -1) {
			this.runningTasks.splice(index, 1);
		}
		if (!this.runningTasks.length && !this.runningTimers.length) {
			this.cancelAll();
		}
	}

	/**
	 * Returns the amount of running tasks.
	 *
	 * @returns Count.
	 */
	public getTaskCount(): number {
		return this.runningTasks.length;
	}

	/**
	 * Returns the amount of running timers.
	 *
	 * @returns Count.
	 */
	public getTimerCount(): number {
		return this.runningTimers.length;
	}

	/**
	 * Returns a new task ID.
	 *
	 * @returns Task ID.
	 */
	private newTaskID(): number {
		(<typeof AsyncTaskManager>this.constructor).taskID++;
		return (<typeof AsyncTaskManager>this.constructor).taskID;
	}
}
