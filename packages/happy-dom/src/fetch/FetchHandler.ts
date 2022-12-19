import RelativeURL from '../location/RelativeURL';
import IRequestInit from './IRequestInit';
import IDocument from '../nodes/document/IDocument';
import IResponse from './IResponse';
import Response from './Response';
import NodeFetch, { RequestInit } from 'node-fetch';
import Request from './Request';
import RequestInfo from './IRequestInfo';
import { URL } from 'url';
import Blob from '../file/Blob';
import FormDataUtility from '../form-data/FormDataUtility';
import FormData from '../form-data/FormData';

/**
 * Helper class for performing fetch.
 */
export default class FetchHandler {
	/**
	 * Returns resource data asynchronously.
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
		const taskManager = document.defaultView.happyDOM.asyncTaskManager;
		const requestInit = { ...init, headers: { ...init?.headers } };
		const cookie = document.defaultView.document.cookie;
		const referer = document.defaultView.location.origin;

		requestInit.headers['user-agent'] = document.defaultView.navigator.userAgent;

		// We need set referer to solve anti-hotlinking.
		// And the browser will set the referer to the origin of the page.
		// Referer is "null" when the URL is set to "about:blank".
		// This is also how the browser behaves.
		if (referer !== 'null') {
			requestInit.headers['referer'] = referer;
		}

		if (cookie) {
			requestInit.headers['set-cookie'] = cookie;
		}

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

		if (requestInit.body instanceof Blob) {
			const buffer = requestInit.body._buffer;
			const type = requestInit.body.type;

			requestInit.body = buffer;

			if (type) {
				requestInit.headers['content-type'] = type;
			}
		} else if (requestInit.body instanceof FormData) {
			const { stream, type } = FormDataUtility.formDataToStream(
				document.defaultView,
				<FormData>requestInit.body
			);
			requestInit.body = stream;
			requestInit.headers['content-type'] = type;
		}

		return new Promise((resolve, reject) => {
			const taskID = taskManager.startTask();

			if (requestInit.signal) {
				requestInit.signal.addEventListener('abort', () => {
					taskManager.endTask(taskID);
				});
			}

			NodeFetch(request, <RequestInit>(<unknown>requestInit))
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
