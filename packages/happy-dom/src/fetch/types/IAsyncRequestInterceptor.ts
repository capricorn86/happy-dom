import Request from '../Request.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import Response from '../Response.js';

export default interface IAsyncRequestInterceptor {
	/**
	 * Hook dispatched before sending out async fetches.
	 * It can be used for modifying the request, providing a response without making a request or for logging.
	 *
	 * @param request The request about to be sent out.
	 * @param window The window from where the request originates.
	 *
	 * @returns Promise that can resolve to a response to be used instead of sending out the response.
	 */
	beforeSend?: (request: Request, window: BrowserWindow) => Promise<Response | void>;
}
