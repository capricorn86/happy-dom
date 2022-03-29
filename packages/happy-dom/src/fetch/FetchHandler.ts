import RelativeURL from '../location/RelativeURL';
import IRequestInit from './IRequestInit';
import IDocument from '../nodes/document/IDocument';
import IResponse from './IResponse';

/**
 * Helper class for performing fetch.
 */
export default class FetchHandler {
	/**
	 * Returns resource data asynchonously.
	 *
	 * @param document Document.
	 * @param url URL to resource.
	 * @param [init] Init.
	 * @returns Response.
	 */
	public static fetch(document: IDocument, url: string, init?: IRequestInit): Promise<IResponse> {
		// We want to only load NodeFetch when it is needed to improve performance and not have direct dependencies to server side packages.
		const nodeFetch = require('node-fetch');
		const Response = require('./Response').default;
		const taskManager = document.defaultView.happyDOM.asyncTaskManager;

		return new Promise((resolve, reject) => {
			const taskID = taskManager.startTask();

			nodeFetch(RelativeURL.getAbsoluteURL(document.defaultView.location, url), init)
				.then((response) => {
					if (taskManager.getTaskCount() === 0) {
						reject(new Error('Failed to complete fetch request. Task was canceled.'));
					} else {
						response.constructor['_ownerDocument'] = document;

						for (const key of Object.keys(Response.prototype)) {
							if (Response.prototype.hasOwnProperty(key) && key !== 'constructor') {
								if (typeof Response.prototype[key] === 'function') {
									response[key] = Response.prototype[key].bind(response);
								} else {
									response[key] = Response.prototype[key];
								}
							}
						}

						taskManager.endTask(taskID);
						resolve(response);
					}
				})
				.catch((error) => {
					reject(error);
					taskManager.cancelAll(error);
				});
		});
	}
}
