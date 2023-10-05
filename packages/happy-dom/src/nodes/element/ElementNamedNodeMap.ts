import NamespaceURI from '../../config/NamespaceURI.js';
import MutationRecord from '../../mutation-observer/MutationRecord.js';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import IAttr from '../attr/IAttr.js';
import IDocument from '../document/IDocument.js';
import Element from './Element.js';
import HTMLCollection from './HTMLCollection.js';
import IElement from './IElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class ElementNamedNodeMap extends NamedNodeMap {
	protected _ownerElement: Element;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 */
	constructor(ownerElement: Element) {
		super();
		this._ownerElement = ownerElement;
	}

	/**
	 * @override
	 */
	public override getNamedItem(name: string): IAttr | null {
		return this._namedItems[this._getAttributeName(name)] || null;
	}

	/**
	 * @override
	 */
	public override getNamedItemNS(namespace: string, localName: string): IAttr | null {
		return super.getNamedItemNS(namespace, this._getAttributeName(localName));
	}

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		if (!item.name) {
			return null;
		}

		item.name = this._getAttributeName(item.name);
		(<IElement>item.ownerElement) = this._ownerElement;
		(<IDocument>item.ownerDocument) = this._ownerElement.ownerDocument;

		const replacedItem = super.setNamedItem(item);
		const oldValue = replacedItem ? replacedItem.value : null;

		if (this._ownerElement.isConnected) {
			this._ownerElement.ownerDocument['_cacheID']++;
		}

		if (item.name === 'class' && this._ownerElement._classList) {
			this._ownerElement._classList._updateIndices();
		}

		if (item.name === 'id' || item.name === 'name') {
			if (
				this._ownerElement.parentNode &&
				(<Element>this._ownerElement.parentNode)._children &&
				item.value !== oldValue
			) {
				if (oldValue) {
					(<HTMLCollection<IElement>>(
						(<Element>this._ownerElement.parentNode)._children
					))._removeNamedItem(this._ownerElement, oldValue);
				}
				if (item.value) {
					(<HTMLCollection<IElement>>(
						(<Element>this._ownerElement.parentNode)._children
					))._appendNamedItem(this._ownerElement, item.value);
				}
			}
		}

		if (
			this._ownerElement.attributeChangedCallback &&
			(<typeof Element>this._ownerElement.constructor)._observedAttributes &&
			(<typeof Element>this._ownerElement.constructor)._observedAttributes.includes(item.name)
		) {
			this._ownerElement.attributeChangedCallback(item.name, oldValue, item.value);
		}

		// MutationObserver
		if (this._ownerElement._observers.length > 0) {
			for (const observer of this._ownerElement._observers) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter ||
						observer.options.attributeFilter.includes(item.name))
				) {
					const record = new MutationRecord();
					record.target = this._ownerElement;
					record.type = MutationTypeEnum.attributes;
					record.attributeName = item.name;
					record.oldValue = observer.options.attributeOldValue ? oldValue : null;
					observer.callback([record], observer.observer);
				}
			}
		}

		return replacedItem || null;
	}

	/**
	 * @override
	 */
	public override _removeNamedItem(name: string): IAttr | null {
		const removedItem = super._removeNamedItem(this._getAttributeName(name));

		if (!removedItem) {
			return null;
		}

		if (this._ownerElement.isConnected) {
			this._ownerElement.ownerDocument['_cacheID']++;
		}

		if (removedItem.name === 'class' && this._ownerElement._classList) {
			this._ownerElement._classList._updateIndices();
		}

		if (removedItem.name === 'id' || removedItem.name === 'name') {
			if (
				this._ownerElement.parentNode &&
				(<Element>this._ownerElement.parentNode)._children &&
				removedItem.value
			) {
				(<HTMLCollection<IElement>>(
					(<Element>this._ownerElement.parentNode)._children
				))._removeNamedItem(this._ownerElement, removedItem.value);
			}
		}

		if (
			this._ownerElement.attributeChangedCallback &&
			(<typeof Element>this._ownerElement.constructor)._observedAttributes &&
			(<typeof Element>this._ownerElement.constructor)._observedAttributes.includes(
				removedItem.name
			)
		) {
			this._ownerElement.attributeChangedCallback(removedItem.name, removedItem.value, null);
		}

		// MutationObserver
		if (this._ownerElement._observers.length > 0) {
			for (const observer of this._ownerElement._observers) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter ||
						observer.options.attributeFilter.includes(removedItem.name))
				) {
					const record = new MutationRecord();
					record.target = this._ownerElement;
					record.type = MutationTypeEnum.attributes;
					record.attributeName = removedItem.name;
					record.oldValue = observer.options.attributeOldValue ? removedItem.value : null;
					observer.callback([record], observer.observer);
				}
			}
		}

		return removedItem;
	}

	/**
	 * @override
	 */
	public override removeNamedItemNS(namespace: string, localName: string): IAttr | null {
		return super.removeNamedItemNS(namespace, this._getAttributeName(localName));
	}

	/**
	 * Returns attribute name.
	 *
	 * @param name Name.
	 * @returns Attribute name based on namespace.
	 */
	protected _getAttributeName(name): string {
		if (this._ownerElement.namespaceURI === NamespaceURI.svg) {
			return name;
		}
		return name.toLowerCase();
	}
}
