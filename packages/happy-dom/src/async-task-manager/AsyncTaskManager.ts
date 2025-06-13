import IBrowserFrame from '../browser/types/IBrowserFrame.js';

// We need to set this as a global constant, so that using fake timers in Jest and Vitest won't override this on the global object.
const TIMER = {
	setTimeout: globalThis.setTimeout.bind(globalThis),
	clearTimeout: globalThis.clearTimeout.bind(globalThis),
	clearImmediate: globalThis.clearImmediate.bind(globalThis)
};

/**
 * Handles async tasks.
 */
export default class AsyncTaskManager {
	private static taskID = 0;
	private runningTasks: { [k: string]: (destroy: boolean) => void } = {};
	private runningTaskCount = 0;
	private runningTimers: NodeJS.Timeout[] = [];
	private runningImmediates: NodeJS.Immediate[] = [];
	private debugTrace: Map<number | NodeJS.Timeout | NodeJS.Immediate, string> = new Map();
	private waitUntilCompleteTimer: NodeJS.Timeout | null = null;
	private waitUntilCompleteResolvers: Array<{
		resolve: () => void;
		reject: (error: Error) => void;
	}> = [];
	private aborted = false;
	private destroyed = false;
	#debugTimeout: NodeJS.Timeout | null = null;
	#browserFrame: IBrowserFrame;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		this.#browserFrame = browserFrame;
	}

	/**
	 * Returns a promise that is resolved when async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public waitUntilComplete(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.waitUntilCompleteResolvers.push({ resolve, reject });
			this.resolveWhenComplete();
		});
	}

	/**
	 * Aborts all tasks.
	 */
	public abort(): Promise<void> {
		if (this.aborted) {
			return new Promise((resolve, reject) => {
				this.waitUntilCompleteResolvers.push({ resolve, reject });
				this.resolveWhenComplete();
			});
		}
		return this.abortAll(false);
	}

	/**
	 * Destroys the manager.
	 */
	public destroy(): Promise<void> {
		if (this.aborted) {
			return new Promise((resolve, reject) => {
				this.waitUntilCompleteResolvers.push({ resolve, reject });
				this.resolveWhenComplete();
			});
		}
		return this.abortAll(true);
	}

	/**
	 * Starts a timer.
	 *
	 * @param timerID Timer ID.
	 */
	public startTimer(timerID: NodeJS.Timeout): void {
		if (this.aborted) {
			TIMER.clearTimeout(timerID);
			return;
		}
		if (this.waitUntilCompleteTimer) {
			TIMER.clearTimeout(this.waitUntilCompleteTimer);
			this.waitUntilCompleteTimer = null;
		}
		this.runningTimers.push(timerID);
		if (this.#browserFrame.page.context.browser.settings.debug.traceWaitUntilComplete > 0) {
			this.debugTrace.set(timerID, new Error().stack!);
		}
	}

	/**
	 * Ends a timer.
	 *
	 * @param timerID Timer ID.
	 */
	public endTimer(timerID: NodeJS.Timeout): void {
		if (this.aborted) {
			TIMER.clearTimeout(timerID);
			return;
		}
		const index = this.runningTimers.indexOf(timerID);
		if (index !== -1) {
			this.runningTimers.splice(index, 1);
			this.resolveWhenComplete();
		}
		if (this.#browserFrame.page.context.browser.settings.debug.traceWaitUntilComplete > 0) {
			this.debugTrace.delete(timerID);
		}
	}

	/**
	 * Starts an immediate.
	 *
	 * @param immediateID Immediate ID.
	 */
	public startImmediate(immediateID: NodeJS.Immediate): void {
		if (this.aborted) {
			TIMER.clearImmediate(immediateID);
			return;
		}
		if (this.waitUntilCompleteTimer) {
			TIMER.clearTimeout(this.waitUntilCompleteTimer);
			this.waitUntilCompleteTimer = null;
		}
		this.runningImmediates.push(immediateID);
		if (this.#browserFrame.page.context.browser.settings.debug.traceWaitUntilComplete > 0) {
			this.debugTrace.set(immediateID, new Error().stack!);
		}
	}

	/**
	 * Ends an immediate.
	 *
	 * @param immediateID Immediate ID.
	 */
	public endImmediate(immediateID: NodeJS.Immediate): void {
		if (this.aborted) {
			TIMER.clearImmediate(immediateID);
			return;
		}
		const index = this.runningImmediates.indexOf(immediateID);
		if (index !== -1) {
			this.runningImmediates.splice(index, 1);
			this.resolveWhenComplete();
		}
		if (this.#browserFrame.page.context.browser.settings.debug.traceWaitUntilComplete > 0) {
			this.debugTrace.delete(immediateID);
		}
	}

	/**
	 * Starts an async task.
	 *
	 * @param abortHandler Abort handler.
	 * @returns Task ID.
	 */
	public startTask(abortHandler?: (destroy?: boolean) => void): number {
		if (this.aborted) {
			if (abortHandler) {
				abortHandler(this.destroyed);
			}
			throw new this.#browserFrame.window.Error(
				`Failed to execute 'startTask()' on 'AsyncTaskManager': The asynchrounous task manager has been aborted.`
			);
		}
		if (this.waitUntilCompleteTimer) {
			TIMER.clearTimeout(this.waitUntilCompleteTimer);
			this.waitUntilCompleteTimer = null;
		}
		const taskID = this.newTaskID();
		this.runningTasks[taskID] = abortHandler ? abortHandler : () => {};
		this.runningTaskCount++;
		if (this.#browserFrame.page.context.browser.settings.debug.traceWaitUntilComplete > 0) {
			this.debugTrace.set(taskID, new Error().stack!);
		}
		return taskID;
	}

	/**
	 * Ends an async task.
	 *
	 * @param taskID Task ID.
	 */
	public endTask(taskID: number): void {
		if (this.aborted) {
			return;
		}
		if (this.runningTasks[taskID]) {
			delete this.runningTasks[taskID];
			this.runningTaskCount--;
			this.resolveWhenComplete();
		}
		if (this.#browserFrame.page.context.browser.settings.debug.traceWaitUntilComplete > 0) {
			this.debugTrace.delete(taskID);
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
		this.applyDebugging();

		if (this.runningTaskCount || this.runningTimers.length || this.runningImmediates.length) {
			return;
		}

		if (this.waitUntilCompleteTimer) {
			TIMER.clearTimeout(this.waitUntilCompleteTimer);
			this.waitUntilCompleteTimer = null;
		}

		// It is not possible to detect when all microtasks are complete (such as process.nextTick() or promises).
		// To cater for this we use setTimeout() which has the lowest priority and will be executed last.
		// @see https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
		this.waitUntilCompleteTimer = TIMER.setTimeout(() => {
			this.waitUntilCompleteTimer = null;
			if (!this.runningTaskCount && !this.runningTimers.length && !this.runningImmediates.length) {
				if (this.#debugTimeout) {
					TIMER.clearTimeout(this.#debugTimeout);
				}
				const resolvers = this.waitUntilCompleteResolvers;
				this.waitUntilCompleteResolvers = [];
				for (const resolver of resolvers) {
					resolver.resolve();
				}
				this.aborted = false;
			} else {
				this.applyDebugging();
			}
		}, 1);
	}

	/**
	 * Applies debugging.
	 */
	private applyDebugging(): void {
		const debug = this.#browserFrame.page.context.browser.settings.debug;
		if (!debug?.traceWaitUntilComplete || debug.traceWaitUntilComplete < 1) {
			return;
		}
		if (this.#debugTimeout) {
			return;
		}
		this.#debugTimeout = TIMER.setTimeout(() => {
			this.#debugTimeout = null;

			let errorMessage = `The maximum time was reached for "waitUntilComplete()".\n\n${
				this.debugTrace.size
			} task${
				this.debugTrace.size === 1 ? '' : 's'
			} did not end in time.\n\nThe following traces were recorded:\n\n`;

			for (const [key, value] of this.debugTrace.entries()) {
				const type = typeof key === 'number' ? 'Task' : 'Timer';
				errorMessage += `${type} #${key}\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾${value
					.replace(/Error:/, '')
					.replace(/\s+at /gm, '\n> ')}\n\n`;
			}

			const error = new Error(errorMessage);

			for (const resolver of this.waitUntilCompleteResolvers) {
				resolver.reject(error);
			}

			this.abortAll(true);
		}, debug.traceWaitUntilComplete);
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

		this.aborted = true;
		this.destroyed = destroy;
		this.runningTasks = {};
		this.runningTaskCount = 0;
		this.runningImmediates = [];
		this.runningTimers = [];
		this.debugTrace = new Map();

		if (this.waitUntilCompleteTimer) {
			TIMER.clearTimeout(this.waitUntilCompleteTimer);
			this.waitUntilCompleteTimer = null;
		}

		for (const immediate of runningImmediates) {
			TIMER.clearImmediate(immediate);
		}

		for (const timer of runningTimers) {
			TIMER.clearTimeout(timer);
		}

		for (const key of Object.keys(runningTasks)) {
			runningTasks[key](destroy);
		}

		// We need to wait for microtasks to complete before resolving.
		return new Promise((resolve, reject) => {
			this.waitUntilCompleteResolvers.push({ resolve, reject });
			this.resolveWhenComplete();
		});
	}
}
