import NodeFetch from 'node-fetch';
import Window from './Window';
import AsyncTaskManager from './AsyncTaskManager';

const FETCH_RESPONSE_TYPE_METHODS = ['blob', 'json', 'formData', 'text'];

/**
 * Handles the Window.
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
	 * @param {function} callback Function to be executed.
	 * @param {number} [delay] Delay in ms.
	 * @return {NodeJS.Timeout} Timeout ID.
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
	 * @param {NodeJS.Timeout} id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		global.clearTimeout(id);
		this.async.endTask('timeout');
	}

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @param {function} callback Function to be executed.
	 * @param {number} [delay] Delay in ms.
	 * @return {NodeJS.Timeout} Interval ID.
	 */
	public setInterval(callback: () => void, delay?: number): NodeJS.Timeout {
		this.async.startTask('interval');
		return global.setInterval(callback, delay);
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @param {NodeJS.Timeout} id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		global.clearInterval(id);
		this.async.endTask('interval');
	}

	/**
	 * Provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network.
	 *
	 * @param {string} url URL to resource.
	 * @param {object} [options] Options.
	 * @return {Promise<NodeFetch.Response>} Promise.
	 */
	public async fetch(url: string, options: object): Promise<NodeFetch.Response> {
		return new Promise((resolve, reject) => {
			this.async.startTask('fetch');

			NodeFetch(url, options)
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
	 * @return {Promise<void>} Promise.
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
