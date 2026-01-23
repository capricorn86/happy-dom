import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';

/**
 * Document ready state manager.
 */
export default class DocumentReadyStateManager {
	#asyncTaskManager: AsyncTaskManager;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		this.#asyncTaskManager = new AsyncTaskManager(browserFrame);
	}

	/**
	 * Returns a promise that is fulfilled when ready state is complete.
	 *
	 * @returns Promise.
	 */
	public waitUntilComplete(): Promise<void> {
		return this.#asyncTaskManager.waitUntilComplete();
	}

	/**
	 * Starts a task.
	 *
	 * @returns Task ID.
	 */
	public startTask(): number {
		return this.#asyncTaskManager.startTask();
	}

	/**
	 * Ends a task.
	 *
	 * @param taskID Task ID.
	 */
	public endTask(taskID: number): void {
		this.#asyncTaskManager.endTask(taskID);
	}

	/**
	 * Destroys the manager.
	 */
	public destroy(): Promise<void> {
		return this.#asyncTaskManager.destroy();
	}
}
