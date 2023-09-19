import IBrowserContextOptions from '../browser-context/IBrowserContextOptions.js';

/**
 * Happy DOM options.
 *
 * @deprecated
 */
export default interface IHappyDOMOptions extends IBrowserContextOptions {
	/**
	 * @deprecated
	 */
	innerWidth?: number;

	/**
	 * @deprecated
	 */
	innerHeight?: number;
}
