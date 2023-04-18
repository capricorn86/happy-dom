import HTMLElement from '../html-element/HTMLElement';
import INode from '../node/INode';
import IHTMLElement from '../html-element/IHTMLElement';

/**
 * HTML Unknown Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLUnknownElement.
 */
export default class HTMLUnknownElement extends HTMLElement implements IHTMLElement {
	private _customElementDefineCallback: () => void = null;

	/**
	 * Connects this element to another element.
	 *
	 * @param parentNode Parent node.
	 */
	public _connectToNode(parentNode: INode = null): void {
		const tagName = this.tagName;

		// This element can potentially be a custom element that has not been defined yet
		// Therefore we need to register a callback for when it is defined in CustomElementRegistry and replace it with the registered element (see #404)
		if (tagName.includes('-')) {
			const callbacks = this.ownerDocument.defaultView.customElements._callbacks;

			if (parentNode && !this._customElementDefineCallback) {
				const callback = (): void => {
					if (this.parentNode) {
						const newElement = this.ownerDocument.createElement(tagName);
						this.parentNode.insertBefore(newElement, this);
						this.parentNode.removeChild(this);
					}
				};
				callbacks[tagName] = callbacks[tagName] || [];
				callbacks[tagName].push(callback);
				this._customElementDefineCallback = callback;
			} else if (!parentNode && callbacks[tagName] && this._customElementDefineCallback) {
				const index = callbacks[tagName].indexOf(this._customElementDefineCallback);
				if (index !== -1) {
					callbacks[tagName].splice(index, 1);
				}
				if (!callbacks[tagName].length) {
					delete callbacks[tagName];
				}
				this._customElementDefineCallback = null;
			}
		}

		super._connectToNode(parentNode);
	}
}
