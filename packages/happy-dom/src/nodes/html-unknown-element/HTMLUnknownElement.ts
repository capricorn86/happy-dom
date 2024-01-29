import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
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
	public [PropertySymbol.connectToNode](parentNode: INode = null): void {
		const tagName = this[PropertySymbol.tagName];

		// This element can potentially be a custom element that has not been defined yet
		// Therefore we need to register a callback for when it is defined in CustomElementRegistry and replace it with the registered element (see #404)
		if (
			tagName.includes('-') &&
			this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].customElements[
				PropertySymbol.callbacks
			]
		) {
			const callbacks =
				this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].customElements[
					PropertySymbol.callbacks
				];

			if (parentNode && !this.#customElementDefineCallback) {
				const callback = (): void => {
					if (this[PropertySymbol.parentNode]) {
						const newElement = <HTMLElement>(
							this[PropertySymbol.ownerDocument].createElement(tagName)
						);
						(<INodeList<INode>>newElement[PropertySymbol.childNodes]) =
							this[PropertySymbol.childNodes];
						(<IHTMLCollection<IElement>>newElement[PropertySymbol.children]) =
							this[PropertySymbol.children];
						(<boolean>newElement[PropertySymbol.isConnected]) = this[PropertySymbol.isConnected];

						newElement[PropertySymbol.rootNode] = this[PropertySymbol.rootNode];
						newElement[PropertySymbol.formNode] = this[PropertySymbol.formNode];
						newElement[PropertySymbol.selectNode] = this[PropertySymbol.selectNode];
						newElement[PropertySymbol.textAreaNode] = this[PropertySymbol.textAreaNode];
						newElement[PropertySymbol.observers] = this[PropertySymbol.observers];
						newElement[PropertySymbol.isValue] = this[PropertySymbol.isValue];

						for (let i = 0, max = this[PropertySymbol.attributes].length; i < max; i++) {
							newElement[PropertySymbol.attributes].setNamedItem(
								this[PropertySymbol.attributes][i]
							);
						}

						(<INodeList<INode>>this[PropertySymbol.childNodes]) = new NodeList();
						(<IHTMLCollection<IElement>>this[PropertySymbol.children]) = new HTMLCollection();
						this[PropertySymbol.rootNode] = null;
						this[PropertySymbol.formNode] = null;
						this[PropertySymbol.selectNode] = null;
						this[PropertySymbol.textAreaNode] = null;
						this[PropertySymbol.observers] = [];
						this[PropertySymbol.isValue] = null;
						(<HTMLElementNamedNodeMap>this[PropertySymbol.attributes]) =
							new HTMLElementNamedNodeMap(this);

						for (
							let i = 0,
								max = (<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.childNodes]
									.length;
							i < max;
							i++
						) {
							if (
								(<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.childNodes][i] ===
								this
							) {
								(<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.childNodes][i] =
									newElement;
								break;
							}
						}

						if ((<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.children]) {
							for (
								let i = 0,
									max = (<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.children]
										.length;
								i < max;
								i++
							) {
								if (
									(<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.children][i] ===
									this
								) {
									(<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.children][i] =
										newElement;
									break;
								}
							}
						}

						if (newElement[PropertySymbol.isConnected] && newElement.connectedCallback) {
							newElement.connectedCallback();
						}

						this[PropertySymbol.connectToNode](null);
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

		super[PropertySymbol.connectToNode](parentNode);
	}
}
