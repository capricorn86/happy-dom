/**
 * Handles async tasks.
 */
export default class AsyncTaskManager {
	private static taskID = 0;
	private runningTasks: { [k: string]: () => void } = {};
	private runningTaskCount = 0;
	private runningTimers: NodeJS.Timeout[] = [];
	private runningImmediates: NodeJS.Immediate[] = [];
	private whenCompleteImmediate: NodeJS.Immediate | null = null;
	private whenCompleteResolvers: Array<() => void> = [];

	/**
	 * Returns a promise that is resolved when async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public whenComplete(): Promise<void> {
		return new Promise((resolve) => {
			this.whenCompleteResolvers.push(resolve);
			this.endTask(this.startTask());
		});
	}

	/**
	 * Cancels all tasks.
	 */
	public cancelAll(): void {
		const runningTimers = this.runningTimers;
		const runningImmediates = this.runningImmediates;
		const runningTasks = this.runningTasks;

		this.runningTasks = {};
		this.runningTaskCount = 0;
		this.runningImmediates = [];
		this.runningTimers = [];

		if (this.whenCompleteImmediate) {
			global.clearImmediate(this.whenCompleteImmediate);
			this.whenCompleteImmediate = null;
		}

		for (const immediate of runningImmediates) {
			global.clearImmediate(immediate);
		}

		for (const timer of runningTimers) {
			global.clearTimeout(timer);
		}

		for (const key of Object.keys(runningTasks)) {
			runningTasks[key]();
		}

		this.resolveWhenComplete();
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
			if (!this.runningTaskCount && !this.runningTimers.length && !this.runningImmediates.length) {
				this.resolveWhenComplete();
			}
		}
	}

	/**
	 * Starts an immediate.
	 *
	 * @param immediateID Immediate ID.
	 */
	public startImmediate(immediateID: NodeJS.Immediate): void {
		this.runningImmediates.push(immediateID);
	}

	/**
	 * Ends an immediate.
	 *
	 * @param immediateID Immediate ID.
	 */
	public endImmediate(immediateID: NodeJS.Immediate): void {
		const index = this.runningImmediates.indexOf(immediateID);
		if (index !== -1) {
			this.runningImmediates.splice(index, 1);
			if (!this.runningTaskCount && !this.runningTimers.length && !this.runningImmediates.length) {
				this.resolveWhenComplete();
			}
		}
	}

	/**
	 * Starts an async task.
	 *
	 * @param abortHandler Abort handler.
	 * @returns Task ID.
	 */
	public startTask(abortHandler?: () => void): number {
		const taskID = this.newTaskID();
		this.runningTasks[taskID] = abortHandler ? abortHandler : () => {};
		this.runningTaskCount++;
		return taskID;
	}

	/**
	 * Ends an async task.
	 *
	 * @param taskID Task ID.
	 */
	public endTask(taskID: number): void {
		if (this.runningTasks[taskID]) {
			delete this.runningTasks[taskID];
			this.runningTaskCount--;
			if (this.whenCompleteImmediate) {
				global.clearImmediate(this.whenCompleteImmediate);
			}
			if (!this.runningTaskCount && !this.runningTimers.length && !this.runningImmediates.length) {
				this.whenCompleteImmediate = global.setImmediate(() => {
					this.whenCompleteImmediate = null;
					if (
						!this.runningTaskCount &&
						!this.runningTimers.length &&
						!this.runningImmediates.length
					) {
						this.resolveWhenComplete();
					}
				});
			}
		}
	}

	/**
	 * Returns the amount of running tasks.
	 *
	 * @returns Count.
	 */
	public getTaskCount(): number {
		return this.runningTaskCount;
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

	/**
	 * Resolves when complete.
	 */
	private resolveWhenComplete(): void {
		const resolvers = this.whenCompleteResolvers;
		this.whenCompleteResolvers = [];
		for (const resolver of resolvers) {
			resolver();
		}
	}
}
