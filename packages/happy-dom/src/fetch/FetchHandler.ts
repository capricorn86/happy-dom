import URL from '../location/URL';
import RelativeURL from '../location/RelativeURL';
import { RequestInfo } from './IRequest';
import IRequestInit from './IRequestInit';
import IDocument from '../nodes/document/IDocument';
import IResponse from './IResponse';
import Response from './Response';
import NodeFetch from 'node-fetch';
import { Request } from 'node-fetch';

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
	public static fetch(
		document: IDocument,
		url: RequestInfo,
		init?: IRequestInit
	): Promise<IResponse> {
		// We want to only load NodeFetch when it is needed to improve performance and not have direct dependencies to server side packages.
		const taskManager = document.defaultView.happyDOM.asyncTaskManager;

		return new Promise((resolve, reject) => {
			const taskID = taskManager.startTask();

			let request;
			if (typeof url === 'string') {
				request = new Request(RelativeURL.getAbsoluteURL(document.defaultView.location, url));
			} else if (url instanceof URL) {
				// URLs are always absolute, no need for getAbsoluteURL.
				request = new Request(url);
			} else {
				request = new Request(RelativeURL.getAbsoluteURL(document.defaultView.location, url.url), {
					...url
				});
			}

			NodeFetch(request, init)
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
