import NodeFetch from 'node-fetch';
import Window from './Window';

const FETCH_RESPONSE_TYPE_METHODS = ['blob', 'json', 'formData', 'text'];

/**
 * Handles the Window.
 */
export default class AsyncWindow extends Window {
	// Private Properties
	private isDisposed = false;
	private asyncTaskCount: number = 0;
	private asyncError: Error = null;
	private asyncTimeout: NodeJS.Timeout = null;
	private asyncPromises: { resolve: () => void; reject: (error: Error) => void }[] = [];

	/**
	 * Sets a timer which executes a function once the timer expires.
	 *
	 * @param {function} callback Function to be executed.
	 * @param {number} [delay] Delay in ms.
	 * @return {NodeJS.Timeout} Timeout ID.
	 */
	public setTimeout(callback: () => void, delay?: number): NodeJS.Timeout {
		this.startAsyncTask();
		return setTimeout(() => {
			this.endAsyncTask();
			callback();
		}, delay);
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @param {NodeJS.Timeout} id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		clearTimeout(id);
		this.endAsyncTask();
	}

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @param {function} callback Function to be executed.
	 * @param {number} [delay] Delay in ms.
	 * @return {NodeJS.Timeout} Interval ID.
	 */
	public setInterval(callback: () => void, delay?: number): NodeJS.Timeout {
		this.startAsyncTask();
		return setInterval(callback, delay);
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @param {NodeJS.Timeout} id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		clearInterval(id);
		this.endAsyncTask();
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
			this.startAsyncTask();

			NodeFetch(url, options)
				.then(response => {
					for (const methodName of FETCH_RESPONSE_TYPE_METHODS) {
						const asyncMethod = response[methodName];
						response[methodName] = () => {
							return new Promise((resolve, reject) => {
								this.startAsyncTask();

								asyncMethod
									.then(response => {
										this.endAsyncTask();
										resolve(response);
									})
									.catch(error => {
										this.endAsyncTask(error);
										reject(error);
									});
							});
						};
					}

					this.endAsyncTask();
					resolve(response);
				})
				.catch(error => {
					this.endAsyncTask(error);
					reject(error);
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
		return new Promise((resolve, reject) => {
			this.startAsyncTask();
			this.asyncPromises.push({ resolve, reject });
			this.endAsyncTask();
		});
	}

	/**
	 * Disposes the window.
	 */
	public dispose(): void {
		super.dispose();
		this.isDisposed = true;
		this.asyncError = null;
		this.asyncTaskCount = 0;
		this.asyncPromises = [];
		clearTimeout(this.asyncTimeout);
	}

	/**
	 * Starts an async task.
	 */
	private startAsyncTask(): void {
		this.asyncTaskCount++;
	}

	/**
	 * Ends an async task.
	 *
	 * @param {Error} [error] Error.
	 */
	private endAsyncTask(error?: Error): void {
		if (!this.isDisposed) {
			this.asyncTaskCount--;

			if (error && !this.asyncError) {
				this.asyncError = error;
			}

			clearTimeout(this.asyncTimeout);
			this.asyncTimeout = setTimeout(() => {
				if (!this.isDisposed) {
					const promises = this.asyncPromises;

					if (this.asyncError) {
						this.asyncPromises = [];
						for (const promise of promises) {
							promise.reject(this.asyncError);
						}
					} else if (this.asyncTaskCount === 0) {
						this.asyncPromises = [];
						for (const promise of promises) {
							promise.resolve();
						}
					}
				}
			}, 0);
		}
	}
}
