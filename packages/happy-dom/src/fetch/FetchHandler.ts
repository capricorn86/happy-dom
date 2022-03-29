import RelativeURL from '../location/RelativeURL';
import Window from '../window/Window';
import DOMException from '../exception/DOMException';

/**
 * Helper class for performing an asynchonous or synchrounous request to a resource.
 */
export default class FetchHandler {
	/**
	 * Returns resource data asynchonously.
	 *
	 * @param window Window.
	 * @param url URL to resource.
	 * @param [init] Init.
	 * @returns Response.
	 */
	public static async fetch(window: Window, url: string, init?: IFetchInit): Promise<string> {
		return new Promise((resolve, reject) => {
			const fetch = require('node-fetch');

			window.happyDOM.asyncTaskManager.startTask(AsyncTaskTypeEnum.fetch);

			fetch(RelativeURL.getAbsoluteURL(window.location, url), init)
				.then((response) => {
					if (window.happyDOM.asyncTaskManager.getRunningCount(AsyncTaskTypeEnum.fetch) === 0) {
						reject(new Error('Failed to complete fetch request. Task was canceled.'));
					} else {
						for (const methodName of FETCH_RESPONSE_TYPE_METHODS) {
							const asyncMethod = response[methodName];
							response[methodName] = () => {
								return new Promise((resolve, reject) => {
									window.happyDOM.asyncTaskManager.startTask(AsyncTaskTypeEnum.fetch);

									asyncMethod
										.call(response)
										.then((response) => {
											if (
												window.happyDOM.asyncTaskManager.getRunningCount(
													AsyncTaskTypeEnum.fetch
												) === 0
											) {
												reject(new Error('Failed to complete fetch request. Task was canceled.'));
											} else {
												resolve(response);
												window.happyDOM.asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch);
											}
										})
										.catch((error) => {
											reject(error);
											window.happyDOM.asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch, error);
										});
								});
							};
						}

						resolve(response);
						window.happyDOM.asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch);
					}
				})
				.catch((error) => {
					reject(error);
					window.happyDOM.asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch, error);
				});
		});
	}

	/**
	 * Returns resource data asynchonously.
	 *
	 * @param options Options.
	 * @param options.window Location.
	 * @param options.url URL.
	 * @param window
	 * @param url
	 * @returns Response.
	 */
	public static async fetchResource(window: Window, url: string): Promise<string> {
		const response = await this.fetch(window, url);
		if (!response.ok) {
			throw new DOMException(
				`Failed to perform request to "${url}". Status code: ${response.status}`
			);
		}
		return await response.text();
	}

	/**
	 * Returns resource data synchonously.
	 *
	 * @param options Options.
	 * @param options.window Location.
	 * @param options.url URL.
	 * @param window
	 * @param url
	 * @returns Response.
	 */
	private static fetchResourceSync(window: Window, url: string): string {
		const url = RelativeURL.getAbsoluteURL(window.location, url);
		let request = null;

		try {
			request = require('sync-request');
		} catch (error) {
			throw new DOMException('Failed to load script. "sync-request" could not be loaded.');
		}

		const response = request('GET', url);

		if (response.isError()) {
			throw new DOMException(
				`Failed to perform request to "${url}". Status code: ${response.statusCode}`
			);
		}

		return response.getBody();
	}
}
