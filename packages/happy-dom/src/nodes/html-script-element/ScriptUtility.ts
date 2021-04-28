import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';
import ResourceFetcher from '../../fetch/ResourceFetcher';
import HTMLScriptElement from './HTMLScriptElement';

/**
 * Helper class for getting the URL relative to a Location object.
 */
export default class ScriptUtility {
	/**
	 * Returns a URL relative to the given Location object.
	 *
	 * @param options Options.
	 * @param options.element Element.
	 */
	public static async loadExternalScript(element: HTMLScriptElement): Promise<void> {
		const src = element.getAttributeNS(null, 'src');
		const async = element.getAttributeNS(null, 'async') !== null;
		if (async) {
			let code = null;
			try {
				code = await ResourceFetcher.fetch({
					window: element.ownerDocument.defaultView,
					url: src
				});
			} catch (error) {
				element.dispatchEvent(
					new ErrorEvent('error', {
						message: error.message,
						error
					})
				);
			}
			if (code) {
				element.ownerDocument.defaultView.eval(code);
				element.dispatchEvent(new Event('load'));
			}
		} else {
			let code = null;
			try {
				code = ResourceFetcher.fetchSync({
					window: element.ownerDocument.defaultView,
					url: src
				});
			} catch (error) {
				element.dispatchEvent(
					new ErrorEvent('error', {
						message: error.message,
						error
					})
				);
			}
			if (code) {
				element.ownerDocument.defaultView.eval(code);
				element.dispatchEvent(new Event('load'));
			}
		}
	}
}
