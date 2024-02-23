// We need to set this as a global constant, so that using fake timers in Jest and Vitest won't override this on the global object.
const TIMER = {
	setImmediate: globalThis.setImmediate.bind(globalThis),
	clearImmediate: globalThis.clearImmediate.bind(globalThis),
	clearTimeout: globalThis.clearTimeout.bind(globalThis)
};

/**
 * Handles async tasks.
 */
export default class AsyncTaskManager {
	private static taskID = 0;
	private runningTasks: { [k: string]: (destroy: boolean) => void | Promise<void> } = {};
	private runningTaskCount = 0;
	private runningTimers: NodeJS.Timeout[] = [];
	private runningImmediates: NodeJS.Immediate[] = [];
	private waitUntilCompleteTimer: NodeJS.Immediate | null = null;
	private waitUntilCompleteResolvers: Array<() => void> = [];

	/**
	 * Returns a promise that is resolved when async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public waitUntilComplete(): Promise<void> {
		return new Promise((resolve) => {
			this.waitUntilCompleteResolvers.push(resolve);
			this.endTask(this.startTask());
		});
	}

	/**
	 * Aborts all tasks.
	 */
	public abort(): Promise<void> {
		return this.abortAll(false);
	}

	/**
	 * Destroys the manager.
	 */
	public destroy(): Promise<void> {
		return this.abortAll(true);
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
			if (this.waitUntilCompleteTimer) {
				TIMER.clearImmediate(this.waitUntilCompleteTimer);
			}
			if (!this.runningTaskCount && !this.runningTimers.length && !this.runningImmediates.length) {
				this.waitUntilCompleteTimer = TIMER.setImmediate(() => {
					this.waitUntilCompleteTimer = null;
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
		const resolvers = this.waitUntilCompleteResolvers;
		this.waitUntilCompleteResolvers = [];
		for (const resolver of resolvers) {
			resolver();
		}
	}

	/**
	 * Aborts all tasks.
	 *
	 * @param destroy Destroy.
	 */
	private abortAll(destroy: boolean): Promise<void> {
		const runningTimers = this.runningTimers;
		const runningImmediates = this.runningImmediates;
		const runningTasks = this.runningTasks;

		this.runningTasks = {};
		this.runningTaskCount = 0;
		this.runningImmediates = [];
		this.runningTimers = [];

		if (this.waitUntilCompleteTimer) {
			TIMER.clearImmediate(this.waitUntilCompleteTimer);
			this.waitUntilCompleteTimer = null;
		}

		for (const immediate of runningImmediates) {
			TIMER.clearImmediate(immediate);
		}

		for (const timer of runningTimers) {
			TIMER.clearTimeout(timer);
		}

		const taskPromises = [];

		for (const key of Object.keys(runningTasks)) {
			const returnValue = runningTasks[key](destroy);
			if (returnValue instanceof Promise) {
				taskPromises.push(returnValue);
			}
		}

		if (taskPromises.length) {
			return Promise.all(taskPromises)
				.then(() => this.waitUntilComplete())
				.catch((error) => {
					/* eslint-disable-next-line no-console */
					console.error(error);
					throw error;
				});
		}

		// We need to wait for microtasks to complete before resolving.
		return this.waitUntilComplete();
	}
}
