import NamespaceURI from '../../config/NamespaceURI.js';
import * as PropertySymbol from '../../PropertySymbol.js';
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
	protected [PropertySymbol.ownerElement]: IElement;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 */
	constructor(ownerElement: IElement) {
		super();
		this[PropertySymbol.ownerElement] = ownerElement;
	}

	/**
	 * @override
	 */
	public override getNamedItem(name: string): IAttr | null {
		return this[PropertySymbol.namedItems][this[PropertySymbol.getAttributeName](name)] || null;
	}

	/**
	 * @override
	 */
	public override getNamedItemNS(namespace: string, localName: string): IAttr | null {
		return super.getNamedItemNS(namespace, this[PropertySymbol.getAttributeName](localName));
	}

	/**
	 * @override
	 */
	public override setNamedItem(item: IAttr): IAttr | null {
		if (!item.name) {
			return null;
		}

		item.name = this[PropertySymbol.getAttributeName](item.name);
		(<IElement>item.ownerElement) = this[PropertySymbol.ownerElement];

		const replacedItem = super.setNamedItem(item);
		const oldValue = replacedItem ? replacedItem.value : null;

		if (this[PropertySymbol.ownerElement].isConnected) {
			this[PropertySymbol.ownerElement].ownerDocument[PropertySymbol.cacheID]++;
		}

		if (item.name === 'class' && this[PropertySymbol.ownerElement][PropertySymbol.classList]) {
			this[PropertySymbol.ownerElement][PropertySymbol.classList][PropertySymbol.updateIndices]();
		}

		if (item.name === 'id' || item.name === 'name') {
			if (
				this[PropertySymbol.ownerElement].parentNode &&
				(<Element>this[PropertySymbol.ownerElement].parentNode)[PropertySymbol.children] &&
				item.value !== oldValue
			) {
				if (oldValue) {
					(<HTMLCollection<IElement>>(
						(<Element>this[PropertySymbol.ownerElement].parentNode)[PropertySymbol.children]
					))[PropertySymbol.removeNamedItem](this[PropertySymbol.ownerElement], oldValue);
				}
				if (item.value) {
					(<HTMLCollection<IElement>>(
						(<Element>this[PropertySymbol.ownerElement].parentNode)[PropertySymbol.children]
					))[PropertySymbol.appendNamedItem](this[PropertySymbol.ownerElement], item.value);
				}
			}
		}

		if (
			this[PropertySymbol.ownerElement].attributeChangedCallback &&
			(<typeof Element>this[PropertySymbol.ownerElement].constructor)[
				PropertySymbol.observedAttributes
			] &&
			(<typeof Element>this[PropertySymbol.ownerElement].constructor)[
				PropertySymbol.observedAttributes
			].includes(item.name)
		) {
			this[PropertySymbol.ownerElement].attributeChangedCallback(item.name, oldValue, item.value);
		}

		// MutationObserver
		if (this[PropertySymbol.ownerElement][PropertySymbol.observers].length > 0) {
			for (const observer of this[PropertySymbol.ownerElement][PropertySymbol.observers]) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter ||
						observer.options.attributeFilter.includes(item.name))
				) {
					const record = new MutationRecord();
					record.target = this[PropertySymbol.ownerElement];
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
	public override [PropertySymbol.removeNamedItem](name: string): IAttr | null {
		const removedItem = super[PropertySymbol.removeNamedItem](
			this[PropertySymbol.getAttributeName](name)
		);

		if (!removedItem) {
			return null;
		}

		if (this[PropertySymbol.ownerElement].isConnected) {
			this[PropertySymbol.ownerElement].ownerDocument[PropertySymbol.cacheID]++;
		}

		if (
			removedItem.name === 'class' &&
			this[PropertySymbol.ownerElement][PropertySymbol.classList]
		) {
			this[PropertySymbol.ownerElement][PropertySymbol.classList][PropertySymbol.updateIndices]();
		}

		if (removedItem.name === 'id' || removedItem.name === 'name') {
			if (
				this[PropertySymbol.ownerElement].parentNode &&
				(<Element>this[PropertySymbol.ownerElement].parentNode)[PropertySymbol.children] &&
				removedItem.value
			) {
				(<HTMLCollection<IElement>>(
					(<Element>this[PropertySymbol.ownerElement].parentNode)[PropertySymbol.children]
				))[PropertySymbol.removeNamedItem](this[PropertySymbol.ownerElement], removedItem.value);
			}
		}

		if (
			this[PropertySymbol.ownerElement].attributeChangedCallback &&
			(<typeof Element>this[PropertySymbol.ownerElement].constructor)[
				PropertySymbol.observedAttributes
			] &&
			(<typeof Element>this[PropertySymbol.ownerElement].constructor)[
				PropertySymbol.observedAttributes
			].includes(removedItem.name)
		) {
			this[PropertySymbol.ownerElement].attributeChangedCallback(
				removedItem.name,
				removedItem.value,
				null
			);
		}

		// MutationObserver
		if (this[PropertySymbol.ownerElement][PropertySymbol.observers].length > 0) {
			for (const observer of this[PropertySymbol.ownerElement][PropertySymbol.observers]) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter ||
						observer.options.attributeFilter.includes(removedItem.name))
				) {
					const record = new MutationRecord();
					record.target = this[PropertySymbol.ownerElement];
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
		return super.removeNamedItemNS(namespace, this[PropertySymbol.getAttributeName](localName));
	}

	/**
	 * Returns attribute name.
	 *
	 * @param name Name.
	 * @returns Attribute name based on namespace.
	 */
	protected [PropertySymbol.getAttributeName](name): string {
		if (this[PropertySymbol.ownerElement].namespaceURI === NamespaceURI.svg) {
			return name;
		}
		return name.toLowerCase();
	}
}
