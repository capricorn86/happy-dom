import RelativeURL from '../../location/RelativeURL';
import Window from '../../window/Window';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class ScriptUtility {
	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param options Options.
	 * @param options.window Location.
	 * @param options.url URL.
	 * @param options.async Async.
	 */
	public static loadExternalScript(options: { window: Window; url: string; async: boolean }): void {
		if (options.async) {
			options.window
				.fetch(options.url)
				.then(response => response.text())
				.then(code => {
					options.window.eval(code);
				})
				.catch(error => {
					throw error;
				});
		} else {
			const url = RelativeURL.getAbsoluteURL(options.window.location, options.url);
			let request = null;

			try {
				request = require('sync-request');
			} catch (error) {
				throw new Error('Failed to load script. "sync-request" could not be loaded.');
			}

			const code = request('GET', url).getBody();
			options.window.eval(code);
		}
	}
}
