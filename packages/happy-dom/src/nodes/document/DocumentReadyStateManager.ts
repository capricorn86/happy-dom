import IWindow from '../../window/IWindow';

/**
 * Document ready state manager.
 */
export default class DocumentReadyStateManager {
	private totalTasks = 0;
	private readyStateCallbacks: (() => void)[] = [];
	private window: IWindow = null;
	private timer: NodeJS.Timeout = null;
	private isComplete = false;

	/**
	 * Constructor.
	 *
	 * @param window
	 */
	constructor(window: IWindow) {
		this.window = window;
	}

	/**
	 * Returns a promise that is fulfilled when ready state is complete.
	 *
	 * @returns Promise.
	 */
	public whenComplete(): Promise<void> {
		return new Promise((resolve) => {
			if (this.isComplete) {
				resolve();
			} else {
				this.readyStateCallbacks.push(resolve);
				if (this.totalTasks === 0 && !this.timer) {
					this.timer = this.window.setTimeout(this.endTask.bind(this));
				}
			}
		});
	}

	/**
	 * Starts a task.
	 */
	public startTask(): void {
		if (this.isComplete) {
			return;
		}

		if (this.timer) {
			this.window.clearTimeout(this.timer);
			this.timer = null;
		}

		this.totalTasks++;
	}

	/**
	 * Ends a task.
	 */
	public endTask(): void {
		if (this.isComplete) {
			return;
		}

		if (this.timer) {
			this.window.clearTimeout(this.timer);
			this.timer = null;
		}

		this.totalTasks--;

		if (this.totalTasks <= 0) {
			const callbacks = this.readyStateCallbacks;

			this.readyStateCallbacks = [];
			this.isComplete = true;

			for (const callback of callbacks) {
				callback();
			}
		}
	}
}
