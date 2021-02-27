import Window from './Window';

/**
 * The async Window makes it possible to wait for asyncrounous tasks to complete by calling the method whenAsyncComplete(). It also adds support for the method fetch().
 */
export default class AsyncWindow extends Window {
	/**
	 * Constructor.
	 */
	constructor() {
		super();

		this.console.warn(
			'⚠ AsyncWindow has been deprecated in Happy DOM. All the functionality of AsyncWindow has been added to Window, so there is no need to use AsyncWindow. AsyncWindow will be removed in the future.'
		);
	}
}
