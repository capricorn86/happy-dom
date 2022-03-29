import * as Fetch from 'node-fetch';
import IRequest from './IRequest';
import IBlob from '../file/IBlob';
import AsyncTaskTypeEnum from '../async-task-manager/AsyncTaskTypeEnum';
import IDocument from '../nodes/document/IDocument';

/**
 * Fetch request.
 */
export default class Request extends Fetch.Request implements IRequest {
	public static _ownerDocument: IDocument = null;

	/**
	 * Returns array buffer.
	 *
	 * @returns Array buffer.
	 */
	public arrayBuffer(): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			this._handlePromiseStart();
			super
				.arrayBuffer()
				.then(this._handlePromiseEnd.bind(this, resolve, reject))
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
			this._handlePromiseStart();
			super
				.blob()
				.then(this._handlePromiseEnd.bind(this, resolve, reject))
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
			this._handlePromiseStart();
			super
				.buffer()
				.then(this._handlePromiseEnd.bind(this, resolve, reject))
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
			this._handlePromiseStart();
			super
				.json()
				.then(this._handlePromiseEnd.bind(this, resolve, reject))
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
			this._handlePromiseStart();
			super
				.text()
				.then(this._handlePromiseEnd.bind(this, resolve, reject))
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
			this._handlePromiseStart();
			super
				.textConverted()
				.then(this._handlePromiseEnd.bind(this, resolve, reject))
				.catch(this._handlePromiseError.bind(this, reject));
		});
	}

	/**
	 * Handles promise start.
	 */
	private _handlePromiseStart(): void {
		const taskManager = (<typeof Request>this.constructor)._ownerDocument.defaultView.happyDOM
			.asyncTaskManager;
		taskManager.startTask(AsyncTaskTypeEnum.fetch);
	}

	/**
	 * Handles promise end.
	 *
	 * @param response
	 * @param resolve
	 * @param reject
	 */
	private _handlePromiseEnd(
		response: ArrayBuffer,
		resolve: (response: ArrayBuffer) => void,
		reject: (error: Error) => void
	): void {
		const taskManager = (<typeof Request>this.constructor)._ownerDocument.defaultView.happyDOM
			.asyncTaskManager;
		if (taskManager.getRunningCount(AsyncTaskTypeEnum.fetch) === 0) {
			reject(new Error('Failed to complete fetch request. Task was canceled.'));
		} else {
			resolve(response);
			taskManager.endTask(AsyncTaskTypeEnum.fetch);
		}
	}

	/**
	 * Handles promise error.
	 *
	 * @param error
	 * @param reject
	 */
	private _handlePromiseError(error: Error, reject: (error: Error) => void): void {
		const taskManager = (<typeof Request>this.constructor)._ownerDocument.defaultView.happyDOM
			.asyncTaskManager;
		reject(error);
		taskManager.endTask(AsyncTaskTypeEnum.fetch, error);
	}
}
