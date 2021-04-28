import AsyncTaskTypeEnum from './AsyncTaskTypeEnum';

/**
 * Handles async tasks.
 */
export default class AsyncTaskManager {
	private tasks: { [k: string]: (NodeJS.Timeout | string)[] } = {};
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
	public cancelAllTasks(error?: Error): void {
		if (this.tasks[AsyncTaskTypeEnum.timer]) {
			for (const id of this.tasks[AsyncTaskTypeEnum.timer]) {
				global.clearTimeout(<NodeJS.Timeout>id);
			}
		}

		const promises = this.queue;

		this.tasks = {};
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
	 * @param id Timer ID.
	 */
	public startTimer(id: NodeJS.Timeout = null): void {
		this.tasks[AsyncTaskTypeEnum.timer] = this.tasks[AsyncTaskTypeEnum.timer] || [];
		this.tasks[AsyncTaskTypeEnum.timer].push(id);
	}

	/**
	 * Ends a timer.
	 *
	 * @param id Timer ID.
	 */
	public endTimer(id: NodeJS.Timeout = null): void {
		if (this.tasks[AsyncTaskTypeEnum.timer]) {
			const index = this.tasks[AsyncTaskTypeEnum.timer].indexOf(id);
			if (index !== -1) {
				this.tasks[AsyncTaskTypeEnum.timer].splice(index, 1);
				if (this.tasks[AsyncTaskTypeEnum.timer].length === 0) {
					delete this.tasks[AsyncTaskTypeEnum.timer];

					if (Object.keys(this.tasks).length === 0) {
						this.cancelAllTasks();
					}
				}
			}
		}
	}

	/**
	 * Starts an async task.
	 *
	 * @param type Task type.
	 */
	public startTask(type: AsyncTaskTypeEnum): void {
		this.tasks[type] = this.tasks[type] || [];
		this.tasks[type].push(type);
	}

	/**
	 * Ends an async task.
	 *
	 * @param type Task type.
	 * @param [error] Error.
	 */
	public endTask(type: AsyncTaskTypeEnum, error?: Error): void {
		if (error) {
			this.cancelAllTasks(error);
		} else if (this.tasks[type]) {
			this.tasks[type].pop();

			if (this.tasks[type].length === 0) {
				delete this.tasks[type];

				if (Object.keys(this.tasks).length === 0) {
					this.cancelAllTasks();
				}
			}
		}
	}

	/**
	 * Returns the amount of running tasks by type.
	 *
	 * @param type Task type.
	 * @returns Count.
	 */
	public getRunningCount(type: AsyncTaskTypeEnum): number {
		if (this.tasks[type]) {
			return this.tasks[type].length;
		}
		return 0;
	}
}
