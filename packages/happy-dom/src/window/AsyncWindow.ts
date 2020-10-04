import { Response, fetch } from 'node-fetch';
import { URLSearchParams } from 'url';
import { Readable } from 'stream';
import Window from './Window';
import AsyncTaskManager from './AsyncTaskManager';

const FETCH_RESPONSE_TYPE_METHODS = ['blob', 'json', 'formData', 'text'];

/**
 * The async Window makes it possible to wait for asyncrounous tasks to complete by calling the method whenAsyncComplete(). It also adds support for the method fetch().
 */
export default class AsyncWindow extends Window {
	// Private Properties
	private async = new AsyncTaskManager();

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
	 * @param [delay] Delay in ms.
	 * @return Timeout ID.
	 */
	public setTimeout(callback: () => void, delay?: number): NodeJS.Timeout {
		this.async.startTask('timeout');
		return global.setTimeout(() => {
			callback();
			this.async.endTask('timeout');
		}, delay);
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @override
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		global.clearTimeout(id);
		this.async.endTask('timeout');
	}

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @override
	 * @param callback Function to be executed.
	 * @param [delay] Delay in ms.
	 * @return Interval ID.
	 */
	public setInterval(callback: () => void, delay?: number): NodeJS.Timeout {
		this.async.startTask('interval');
		return global.setInterval(callback, delay);
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @override
	 * @param id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		global.clearInterval(id);
		this.async.endTask('interval');
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
		}, 0);
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
			this.async.startTask('fetch');

			fetch(url, options)
				.then(response => {
					for (const methodName of FETCH_RESPONSE_TYPE_METHODS) {
						const asyncMethod = response[methodName];
						response[methodName] = () => {
							return new Promise((resolve, reject) => {
								this.async.startTask('fetch');

								asyncMethod
									.then(response => {
										resolve(response);
										this.async.endTask('fetch');
									})
									.catch(error => {
										reject(error);
										this.async.endTask('fetch', error);
									});
							});
						};
					}

					resolve(response);
					this.async.endTask('fetch');
				})
				.catch(error => {
					reject(error);
					this.async.endTask('fetch', error);
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
		return this.async.whenComplete();
	}

	/**
	 * Disposes the window.
	 */
	public dispose(): void {
		super.dispose();
		this.async.dispose();
		this.async = null;
	}
}
