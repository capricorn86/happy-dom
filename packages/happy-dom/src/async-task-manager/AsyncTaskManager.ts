/**
 * Handles async tasks.
 */
export default class AsyncTaskManager {
	private static taskID = 0;
	private runningTasks: { [k: string]: () => void } = {};
	private runningTimers: NodeJS.Timeout[] = [];
	private completionResolver?: {
		promise: Promise<void>;
		resolve?: () => void | PromiseLike<void>;
		done: boolean;
	} = {
		promise: Promise.resolve(),
		done: true
	};

	/**
	 * Returns a promise that is fulfilled when async tasks are complete.
	 * This method is not part of the HTML standard.
	 *
	 * @returns Promise.
	 */
	public whenComplete(): Promise<void> {
		// Reuse the promise existing or create a fresh one
		if (!this.completionResolver) {
			let resolve: () => void | PromiseLike<void>;

			const promise = new Promise<void>((r) => (resolve = r));

			this.completionResolver = { resolve, promise, done: false };
		}

		return this.completionResolver.promise;
	}

	/**
	 * Ends all tasks.
	 *
	 * @param [error] Error.
	 */
	public cancelAll(): void {
		this.endAll(true);
	}

	/**
	 * Starts a timer.
	 *
	 * @param timerID Timer ID.
	 */
	public startTimer(timerID: NodeJS.Timeout): void {
		// New timer, force next call to `whenCompleted()` To create a new promise
		if (this.completionResolver?.done) {
			this.completionResolver = null;
		}

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

		if (!Object.keys(this.runningTasks).length && !this.runningTimers.length) {
			this.endAll();
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
		}

		if (!Object.keys(this.runningTasks).length && !this.runningTimers.length) {
			this.endAll();
		}
	}

	/**
	 * Returns the amount of running tasks.
	 *
	 * @returns Count.
	 */
	public getTaskCount(): number {
		return Object.keys(this.runningTasks).length;
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
	 * Ends all tasks.
	 *
	 * @param [canceled] Canceled.
	 */
	private endAll(canceled?: boolean): void {
		const runningTimers = this.runningTimers;
		const runningTasks = this.runningTasks;

		this.runningTasks = {};
		this.runningTimers = [];

		for (const timer of runningTimers) {
			global.clearTimeout(timer);
		}

		for (const key of Object.keys(runningTasks)) {
			runningTasks[key]();
		}

		if (this.completionResolver) {
			queueMicrotask(() => {
				if (Object.keys(this.runningTasks).length == 0 && this.runningTimers.length == 0) {
					if (canceled) {
						this.completionResolver.resolve();
					} else {
						this.completionResolver.resolve();
					}
				}
			});
		}
	}
}
