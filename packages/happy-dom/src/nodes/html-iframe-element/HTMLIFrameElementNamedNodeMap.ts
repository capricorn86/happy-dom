import Attr from '../attr/Attr.js';
import Element from '../element/Element.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import HTMLIFrameElementPageLoader from './HTMLIFrameElementPageLoader.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';

const SANDBOX_FLAGS = [
	'allow-downloads',
	'allow-forms',
	'allow-modals',
	'allow-orientation-lock',
	'allow-pointer-lock',
	'allow-popups',
	'allow-popups-to-escape-sandbox',
	'allow-presentation',
	'allow-same-origin',
	'allow-scripts',
	'allow-top-navigation',
	'allow-top-navigation-by-user-activation',
	'allow-top-navigation-to-custom-protocols'
];

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class HTMLIFrameElementNamedNodeMap extends HTMLElementNamedNodeMap {
	#pageLoader: HTMLIFrameElementPageLoader;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 * @param pageLoader
	 */
	constructor(ownerElement: Element, pageLoader: HTMLIFrameElementPageLoader) {
		super(ownerElement);
		this.#pageLoader = pageLoader;
	}

	/**
	 * @override
	 */
	public override setNamedItem(item: Attr): Attr | null {
		const replacedAttribute = super.setNamedItem(item);

		if (item[PropertySymbol.name] === 'srcdoc') {
			this.#pageLoader.loadPage();
		}

		// If the src attribute and the srcdoc attribute are both specified together, the srcdoc attribute takes priority.
		if (
			item[PropertySymbol.name] === 'src' &&
			this[PropertySymbol.ownerElement][PropertySymbol.attributes]['srcdoc']?.value === undefined &&
			item[PropertySymbol.value] &&
			item[PropertySymbol.value] !== replacedAttribute?.[PropertySymbol.value]
		) {
			this.#pageLoader.loadPage();
		}

		if (item[PropertySymbol.name] === 'sandbox') {
			if (!this[PropertySymbol.ownerElement][PropertySymbol.sandbox]) {
				this[PropertySymbol.ownerElement][PropertySymbol.sandbox] = new DOMTokenList(
					this[PropertySymbol.ownerElement],
					'sandbox'
				);
			} else {
				this[PropertySymbol.ownerElement][PropertySymbol.sandbox][PropertySymbol.updateIndices]();
			}

			this.#validateSandboxFlags();
		}

		return replacedAttribute || null;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeNamedItem](name: string): Attr | null {
		const removedItem = super[PropertySymbol.removeNamedItem](name);
		if (
			removedItem &&
			(removedItem[PropertySymbol.name] === 'srcdoc' || removedItem[PropertySymbol.name] === 'src')
		) {
			this.#pageLoader.loadPage();
		}

		return removedItem;
	}

	/**
	 *
	 * @param tokens
	 * @param vconsole
	 */
	#validateSandboxFlags(): void {
		const window =
			this[PropertySymbol.ownerElement][PropertySymbol.ownerDocument][PropertySymbol.ownerWindow];
		const values = this[PropertySymbol.ownerElement][PropertySymbol.sandbox].values();
		const invalidFlags: string[] = [];

		for (const token of values) {
			if (!SANDBOX_FLAGS.includes(token)) {
				invalidFlags.push(token);
			}
		}

		if (invalidFlags.length === 1) {
			window.console.error(
				`Error while parsing the 'sandbox' attribute: '${invalidFlags[0]}' is an invalid sandbox flag.`
			);
		} else if (invalidFlags.length > 1) {
			window.console.error(
				`Error while parsing the 'sandbox' attribute: '${invalidFlags.join(
					`', '`
				)}' are invalid sandbox flags.`
			);
		}
	}
}
