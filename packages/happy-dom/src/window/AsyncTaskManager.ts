/**
 * Handles async tasks.
 */
export default class AsyncTaskManager {
	// Private Properties
	private isDisposed = false;
	private tasks: { [k: string]: number } = {};
	private hasError = false;
	private timeout: NodeJS.Timeout = null;
	private queue: { resolve: () => void; reject: (error: Error) => void }[] = [];

	/**
	 * Returns a promise that is fulfilled when async tasks are complete.
	 * This method is not part of the HTML standard.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.startTask('complete');
			this.queue.push({ resolve, reject });
			global.clearTimeout(this.timeout);
			this.timeout = global.setTimeout(() => this.endTask('complete'), 0);
		});
	}

	/**
	 * Disposes the window.
	 */
	public dispose(): void {
		this.isDisposed = true;
		this.hasError = false;
		this.tasks = {};
		this.queue = [];
		global.clearTimeout(this.timeout);
	}

	/**
	 * Starts an async task.
	 *
	 * @param name Name of task.
	 */
	public startTask(name: string): void {
		this.tasks[name] = this.tasks[name] || 0;
		this.tasks[name]++;
	}

	/**
	 * Ends an async task.
	 *
	 * @param name Name of task.
	 * @param [error] Error.
	 */
	public endTask(name: string, error?: Error): void {
		if (!this.isDisposed && this.tasks[name] !== undefined) {
			this.tasks[name]--;

			const promises = this.queue;

			if (error) {
				this.hasError = true;
				this.queue = [];
				for (const promise of promises) {
					promise.reject(error);
				}
			} else if (this.tasks[name] === 0 && !this.hasError) {
				delete this.tasks[name];
				if (Object.keys(this.tasks).length === 0) {
					this.queue = [];
					for (const promise of promises) {
						promise.resolve();
					}
				}
			}
		}
	}
}
