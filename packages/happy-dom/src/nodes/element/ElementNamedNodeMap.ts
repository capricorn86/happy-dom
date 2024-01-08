import NamespaceURI from '../../config/NamespaceURI.js';
import MutationRecord from '../../mutation-observer/MutationRecord.js';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import IAttr from '../attr/IAttr.js';
import Element from './Element.js';
import HTMLCollection from './HTMLCollection.js';
import IElement from './IElement.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class ElementNamedNodeMap extends NamedNodeMap {
	protected __ownerElement__: IElement;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 */
	constructor(ownerElement: IElement) {
		super();
		this.__ownerElement__ = ownerElement;
	}

	/**
	 * @override
	 */
	public override getNamedItem(name: string): IAttr | null {
		return this.__namedItems__[this.__getAttributeName__(name)] || null;
	}

	/**
	 * @override
	 */
	public override getNamedItemNS(namespace: string, localName: string): IAttr | null {
		return super.getNamedItemNS(namespace, this.__getAttributeName__(localName));
	}

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		if (!item.name) {
			return null;
		}

		item.name = this.__getAttributeName__(item.name);
		(<IElement>item.ownerElement) = this.__ownerElement__;

		const replacedItem = super.setNamedItem(item);
		const oldValue = replacedItem ? replacedItem.value : null;

		if (this.__ownerElement__.isConnected) {
			this.__ownerElement__.ownerDocument['__cacheID__']++;
		}

		if (item.name === 'class' && this.__ownerElement__['__classList__']) {
			this.__ownerElement__['__classList__'].__updateIndices__();
		}

		if (item.name === 'id' || item.name === 'name') {
			if (
				this.__ownerElement__.parentNode &&
				(<Element>this.__ownerElement__.parentNode).__children__ &&
				item.value !== oldValue
			) {
				if (oldValue) {
					(<HTMLCollection<IElement>>(
						(<Element>this.__ownerElement__.parentNode).__children__
					)).__removeNamedItem__(this.__ownerElement__, oldValue);
				}
				if (item.value) {
					(<HTMLCollection<IElement>>(
						(<Element>this.__ownerElement__.parentNode).__children__
					)).__appendNamedItem__(this.__ownerElement__, item.value);
				}
			}
		}

		if (
			this.__ownerElement__.attributeChangedCallback &&
			(<typeof Element>this.__ownerElement__.constructor).__observedAttributes__ &&
			(<typeof Element>this.__ownerElement__.constructor).__observedAttributes__.includes(item.name)
		) {
			this.__ownerElement__.attributeChangedCallback(item.name, oldValue, item.value);
		}

		// MutationObserver
		if (this.__ownerElement__['__observers__'].length > 0) {
			for (const observer of this.__ownerElement__['__observers__']) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter ||
						observer.options.attributeFilter.includes(item.name))
				) {
					const record = new MutationRecord();
					record.target = this.__ownerElement__;
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
	public override __removeNamedItem__(name: string): IAttr | null {
		const removedItem = super.__removeNamedItem__(this.__getAttributeName__(name));

		if (!removedItem) {
			return null;
		}

		if (this.__ownerElement__.isConnected) {
			this.__ownerElement__.ownerDocument['__cacheID__']++;
		}

		if (removedItem.name === 'class' && this.__ownerElement__['__classList__']) {
			this.__ownerElement__['__classList__'].__updateIndices__();
		}

		if (removedItem.name === 'id' || removedItem.name === 'name') {
			if (
				this.__ownerElement__.parentNode &&
				(<Element>this.__ownerElement__.parentNode).__children__ &&
				removedItem.value
			) {
				(<HTMLCollection<IElement>>(
					(<Element>this.__ownerElement__.parentNode).__children__
				)).__removeNamedItem__(this.__ownerElement__, removedItem.value);
			}
		}

		if (
			this.__ownerElement__.attributeChangedCallback &&
			(<typeof Element>this.__ownerElement__.constructor).__observedAttributes__ &&
			(<typeof Element>this.__ownerElement__.constructor).__observedAttributes__.includes(
				removedItem.name
			)
		) {
			this.__ownerElement__.attributeChangedCallback(removedItem.name, removedItem.value, null);
		}

		// MutationObserver
		if (this.__ownerElement__['__observers__'].length > 0) {
			for (const observer of this.__ownerElement__['__observers__']) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter ||
						observer.options.attributeFilter.includes(removedItem.name))
				) {
					const record = new MutationRecord();
					record.target = this.__ownerElement__;
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
		return super.removeNamedItemNS(namespace, this.__getAttributeName__(localName));
	}

	/**
	 * Returns attribute name.
	 *
	 * @param name Name.
	 * @returns Attribute name based on namespace.
	 */
	protected __getAttributeName__(name): string {
		if (this.__ownerElement__.namespaceURI === NamespaceURI.svg) {
			return name;
		}
		return name.toLowerCase();
	}
}
