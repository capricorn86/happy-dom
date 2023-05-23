import HTMLElement from '../html-element/HTMLElement';
import INode from '../node/INode';
import IHTMLElement from '../html-element/IHTMLElement';
import INodeList from '../node/INodeList';
import IHTMLCollection from '../element/IHTMLCollection';
import IElement from '../element/IElement';
import NodeList from '../node/NodeList';
import HTMLCollection from '../element/HTMLCollection';

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
						const newElement = <HTMLElement>this.ownerDocument.createElement(tagName);
						(<INodeList<INode>>newElement.childNodes) = this.childNodes;
						(<IHTMLCollection<IElement>>newElement.children) = this.children;
						(<boolean>newElement.isConnected) = this.isConnected;

						newElement._rootNode = this._rootNode;
						newElement._formNode = this._formNode;
						newElement._selectNode = this._selectNode;
						newElement._textAreaNode = this._textAreaNode;
						newElement._observers = this._observers;
						newElement._isValue = this._isValue;
						newElement._attributes = this._attributes;

						(<INodeList<INode>>this.childNodes) = new NodeList();
						(<IHTMLCollection<IElement>>this.children) = new HTMLCollection();
						this._rootNode = null;
						this._formNode = null;
						this._selectNode = null;
						this._textAreaNode = null;
						this._observers = [];
						this._isValue = null;
						this._attributes = {};

						for (let i = 0, max = this.parentNode.childNodes.length; i < max; i++) {
							if (this.parentNode.childNodes[i] === this) {
								this.parentNode.childNodes[i] = newElement;
								break;
							}
						}

						if ((<IElement>this.parentNode).children) {
							for (let i = 0, max = (<IElement>this.parentNode).children.length; i < max; i++) {
								if ((<IElement>this.parentNode).children[i] === this) {
									(<IElement>this.parentNode).children[i] = newElement;
									break;
								}
							}
						}

						if (newElement.isConnected && newElement.connectedCallback) {
							newElement.connectedCallback();
						}
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
