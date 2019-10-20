import Document from '../nodes/basic-types/document/Document';
import Window from '../Window';

/**
 * The DOMImplementation interface represents an object providing methods which are not dependent on any particular document. Such an object is returned by the
 */
export default class DOMImplementation {
	private _window: Window;

	/**
	 * Constructor.
	 *
	 * @param {Window} window Window.
	 */
	constructor(window: Window) {
		this._window = window;
	}

	/**
	 * Creates and returns an HTML Document.
	 */
	public createHTMLDocument(): Document {
		return new Document(this._window);
	}
}
