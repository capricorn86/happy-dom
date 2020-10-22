import { Response, fetch } from 'node-fetch';
import { URLSearchParams } from 'url';
import { Readable } from 'stream';
import Window from './Window';
import AsyncTaskManager from './AsyncTaskManager';
import AsyncTaskTypeEnum from './AsyncTaskTypeEnum';

const FETCH_RESPONSE_TYPE_METHODS = ['blob', 'json', 'formData', 'text'];

/**
 * The async Window makes it possible to wait for asyncrounous tasks to complete by calling the method whenAsyncComplete(). It also adds support for the method fetch().
 */
export default class AsyncWindow extends Window {
	// Private Properties
	private _asyncTaskManager = new AsyncTaskManager();

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Binds all methods to "this", so that it will use the correct context when called globally.
		for (const key of Object.keys(AsyncWindow.prototype)) {
			if (typeof this[key] === 'function') {
				this[key] = this[key].bind(this);
			}
		}
	}

	/**
	 * Sets a timer which executes a function once the timer expires.
	 *
	 * @override
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @return Timeout ID.
	 */
	public setTimeout(callback: () => void, delay = 0): NodeJS.Timeout {
		const id = global.setTimeout(() => {
			this._asyncTaskManager.endTimer(id);
			callback();
		}, delay);
		this._asyncTaskManager.startTimer(id);
		return id;
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @override
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		global.clearTimeout(id);
		this._asyncTaskManager.endTimer(id);
	}

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @override
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @return Interval ID.
	 */
	public setInterval(callback: () => void, delay = 0): NodeJS.Timeout {
		const id = global.setInterval(callback, delay);
		this._asyncTaskManager.startTimer(id);
		return id;
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @override
	 * @param id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		global.clearInterval(id);
		this._asyncTaskManager.endTimer(id);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @override
	 * @param {function} callback Callback.
	 * @returns {NodeJS.Timeout} Timeout ID.
	 */
	public requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Timeout {
		return this.setTimeout(() => {
			callback(2);
		});
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @override
	 * @param {NodeJS.Timeout} id Timeout ID.
	 */
	public cancelAnimationFrame(id): void {
		this.clearTimeout(id);
	}

	/**
	 * Provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network.
	 *
	 * @override
	 * @param url URL to resource.
	 * @param [options] Options.
	 * @returns Promise.
	 */
	public async fetch(
		url: string,
		options: {
			method?: string;
			headers?: Map<string, string> | { [k: string]: string };
			body?: URLSearchParams | string | Readable;
			redirect?: string;
		}
	): Promise<Response> {
		return new Promise((resolve, reject) => {
			this._asyncTaskManager.startTask(AsyncTaskTypeEnum.fetch);

			fetch(url, options)
				.then(response => {
					for (const methodName of FETCH_RESPONSE_TYPE_METHODS) {
						const asyncMethod = response[methodName];
						response[methodName] = () => {
							return new Promise((resolve, reject) => {
								this._asyncTaskManager.startTask(AsyncTaskTypeEnum.fetch);

								asyncMethod
									.then(response => {
										resolve(response);
										this._asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch);
									})
									.catch(error => {
										reject(error);
										this._asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch, error);
									});
							});
						};
					}

					resolve(response);
					this._asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch);
				})
				.catch(error => {
					reject(error);
					this._asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch, error);
				});
		});
	}

	/**
	 * Returns a promise that is fulfilled when async tasks are complete.
	 * This method is not part of the HTML standard.
	 *
	 * @returns Promise.
	 */
	public async whenAsyncComplete(): Promise<void> {
		return this._asyncTaskManager.whenComplete();
	}

	/**
	 * Cancels all async tasks running.
	 */
	public cancelAsync(): void {
		this._asyncTaskManager.cancelAllTasks();
	}
}
