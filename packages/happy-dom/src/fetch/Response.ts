import IResponse from './IResponse';
import IBlob from '../file/IBlob';
import IDocument from '../nodes/document/IDocument';
import * as NodeFetch from 'node-fetch';

/**
 * Fetch response.
 */
export default class Response extends NodeFetch.Response implements IResponse {
	// Owner document is set by a sub-class in the Window constructor
	public static _ownerDocument: IDocument = null;
	public readonly _ownerDocument: IDocument = null;

	/**
	 * Constructor.
	 *
	 * @param [body] An object defining a body for the response (can be omitted)
	 * @param [init] An options object containing any custom settings that you want to apply to the response, or an empty object (which is the default value)
	 */
	constructor(body?: NodeFetch.BodyInit, init?: NodeFetch.ResponseInit) {
		super(body, init);
		this._ownerDocument = (<typeof Response>this.constructor)._ownerDocument;
	}

	/**
	 * Returns array buffer.
	 *
	 * @returns Array buffer.
	 */
	public arrayBuffer(): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.arrayBuffer()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns blob.
	 *
	 * @returns Blob.
	 */
	public blob(): Promise<IBlob> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.blob()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns buffer.
	 *
	 * @returns Buffer.
	 */
	public buffer(): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.buffer()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns json.
	 *
	 * @returns JSON.
	 */
	public json(): Promise<unknown> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.json()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns json.
	 *
	 * @returns JSON.
	 */
	public text(): Promise<string> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.text()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Returns json.
	 *
	 * @returns JSON.
	 */
	public textConverted(): Promise<string> {
		return new Promise((resolve, reject) => {
			const taskID = this._handlePromiseStart();
			super
				.textConverted()
				.then(this._handlePromiseEnd.bind(this, resolve, reject, taskID))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Handles promise start.
	 *
	 * @returns Task ID.
	 */
	private _handlePromiseStart(): number {
		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		return taskManager.startTask();
	}

	/**
	 * Handles promise end.
	 *
	 * @param resolve Resolve.
	 * @param reject Reject.
	 * @param taskID Task ID.
	 * @param response Response.
	 */
	private _handlePromiseEnd(
		resolve: (response: unknown) => void,
		reject: (error: Error) => void,
		taskID: number,
		response: unknown
	): void {
		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		if (taskManager.getTaskCount() === 0) {
			reject(new Error('Failed to complete fetch request. Task was canceled.'));
		} else {
			resolve(response);
			taskManager.endTask(taskID);
		}
	}

	/**
	 * Handles promise error.
	 *
	 * @param error
	 * @param reject
	 */
	private _handlePromiseError(reject: (error: Error) => void, error: Error): void {
		const taskManager = this._ownerDocument.defaultView.happyDOM.asyncTaskManager;
		reject(error);
		taskManager.cancelAll(error);
	}
}
