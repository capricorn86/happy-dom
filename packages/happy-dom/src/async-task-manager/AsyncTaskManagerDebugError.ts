/**
 * Error thrown for retrieving the stack trace during debugging.
 */
export default class AsyncTaskManagerDebugError extends Error {
	/**
	 * Constructor.
	 *
	 * @param message Message.
	 */
	constructor(message?: string) {
		super(message);
		this.name = 'AsyncTaskManagerDebugError';
	}
}
