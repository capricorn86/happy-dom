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
		if (tagName.includes('-') && this.ownerDocument.defaultView.customElements._callbacks) {
			const callbacks = this.ownerDocument.defaultView.customElements._callbacks;

			if (parentNode && !this._customElementDefineCallback) {
				const callback = (): void => {
					if (this.parentNode) {
						const newElement = <HTMLElement>this.ownerDocument.createElement(tagName);
						(<INodeList<INode>>newElement._childNodes) = this._childNodes;
						(<IHTMLCollection<IElement>>newElement._children) = this._children;
						(<boolean>newElement.isConnected) = this.isConnected;

						newElement._rootNode = this._rootNode;
						newElement._formNode = this._formNode;
						newElement._selectNode = this._selectNode;
						newElement._textAreaNode = this._textAreaNode;
						newElement._observers = this._observers;
						newElement._isValue = this._isValue;

						for (let i = 0, max = this.attributes.length; i < max; i++) {
							newElement.attributes.setNamedItem(this.attributes[i]);
						}

						(<INodeList<INode>>this._childNodes) = new NodeList();
						(<IHTMLCollection<IElement>>this._children) = new HTMLCollection();
						this._rootNode = null;
						this._formNode = null;
						this._selectNode = null;
						this._textAreaNode = null;
						this._observers = [];
						this._isValue = null;
						(<HTMLElementNamedNodeMap>this.attributes) = new HTMLElementNamedNodeMap(this);

						for (let i = 0, max = (<HTMLElement>this.parentNode)._childNodes.length; i < max; i++) {
							if ((<HTMLElement>this.parentNode)._childNodes[i] === this) {
								(<HTMLElement>this.parentNode)._childNodes[i] = newElement;
								break;
							}
						}

						if ((<HTMLElement>this.parentNode)._children) {
							for (let i = 0, max = (<HTMLElement>this.parentNode)._children.length; i < max; i++) {
								if ((<HTMLElement>this.parentNode)._children[i] === this) {
									(<HTMLElement>this.parentNode)._children[i] = newElement;
									break;
								}
							}
						}

						if (newElement.isConnected && newElement.connectedCallback) {
							newElement.connectedCallback();
						}

						this._connectToNode(null);
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
