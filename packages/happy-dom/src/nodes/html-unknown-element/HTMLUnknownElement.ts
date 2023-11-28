import HTMLElement from '../html-element/HTMLElement.js';
import INode from '../node/INode.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import INodeList from '../node/INodeList.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import IElement from '../element/IElement.js';
import NodeList from '../node/NodeList.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';

/**
 * HTML Unknown Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLUnknownElement.
 */
export default class HTMLUnknownElement extends HTMLElement implements IHTMLElement {
	#customElementDefineCallback: () => void = null;

	/**
	 * Connects this element to another element.
	 *
	 * @param parentNode Parent node.
	 */
	public __connectToNode__(parentNode: INode = null): void {
		const tagName = this.tagName;

		// This element can potentially be a custom element that has not been defined yet
		// Therefore we need to register a callback for when it is defined in CustomElementRegistry and replace it with the registered element (see #404)
		if (tagName.includes('-') && this.ownerDocument.__defaultView__.customElements.__callbacks__) {
			const callbacks = this.ownerDocument.__defaultView__.customElements.__callbacks__;

			if (parentNode && !this.#customElementDefineCallback) {
				const callback = (): void => {
					if (this.parentNode) {
						const newElement = <HTMLElement>this.ownerDocument.createElement(tagName);
						(<INodeList<INode>>newElement.__childNodes__) = this.__childNodes__;
						(<IHTMLCollection<IElement>>newElement.__children__) = this.__children__;
						(<boolean>newElement.isConnected) = this.isConnected;

						newElement.__rootNode__ = this.__rootNode__;
						newElement.__formNode__ = this.__formNode__;
						newElement.__selectNode__ = this.__selectNode__;
						newElement.__textAreaNode__ = this.__textAreaNode__;
						newElement.__observers__ = this.__observers__;
						newElement.__isValue__ = this.__isValue__;

						for (let i = 0, max = this.attributes.length; i < max; i++) {
							newElement.attributes.setNamedItem(this.attributes[i]);
						}

						(<INodeList<INode>>this.__childNodes__) = new NodeList();
						(<IHTMLCollection<IElement>>this.__children__) = new HTMLCollection();
						this.__rootNode__ = null;
						this.__formNode__ = null;
						this.__selectNode__ = null;
						this.__textAreaNode__ = null;
						this.__observers__ = [];
						this.__isValue__ = null;
						(<HTMLElementNamedNodeMap>this.attributes) = new HTMLElementNamedNodeMap(this);

						for (
							let i = 0, max = (<HTMLElement>this.parentNode).__childNodes__.length;
							i < max;
							i++
						) {
							if ((<HTMLElement>this.parentNode).__childNodes__[i] === this) {
								(<HTMLElement>this.parentNode).__childNodes__[i] = newElement;
								break;
							}
						}

						if ((<HTMLElement>this.parentNode).__children__) {
							for (
								let i = 0, max = (<HTMLElement>this.parentNode).__children__.length;
								i < max;
								i++
							) {
								if ((<HTMLElement>this.parentNode).__children__[i] === this) {
									(<HTMLElement>this.parentNode).__children__[i] = newElement;
									break;
								}
							}
						}

						if (newElement.isConnected && newElement.connectedCallback) {
							debugger;
							newElement.connectedCallback();
						}

						this.__connectToNode__(null);
					}
				};
				callbacks[tagName] = callbacks[tagName] || [];
				callbacks[tagName].push(callback);
				this.#customElementDefineCallback = callback;
			} else if (!parentNode && callbacks[tagName] && this.#customElementDefineCallback) {
				const index = callbacks[tagName].indexOf(this.#customElementDefineCallback);
				if (index !== -1) {
					callbacks[tagName].splice(index, 1);
				}
				if (!callbacks[tagName].length) {
					delete callbacks[tagName];
				}
				this.#customElementDefineCallback = null;
			}
		}

		super.__connectToNode__(parentNode);
	}
}
