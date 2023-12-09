import DOMException from '../exception/DOMException.js';
import HTMLElement from '../nodes/html-element/HTMLElement.js';
import Node from '../nodes/node/Node.js';

/**
 * Custom elements registry.
 */
export default class CustomElementRegistry {
	public _registry: { [k: string]: { elementClass: typeof HTMLElement; extends: string } } = {};
	public _callbacks: { [k: string]: (() => void)[] } = {};

	/**
	 * Validates the correctness of custom element tag names.
	 *
	 * @param tagName custom element tag name.
	 * @returns boolean True, if tag name is standard compliant.
	 */
	private isValidCustomElementName(tagName: string): boolean {
		// Validation criteria based on:
		// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
		const PCENChar =
			'[-_.]|[0-9]|[a-z]|\u{B7}|[\u{C0}-\u{D6}]|[\u{D8}-\u{F6}]' +
			'|[\u{F8}-\u{37D}]|[\u{37F}-\u{1FFF}]' +
			'|[\u{200C}-\u{200D}]|[\u{203F}-\u{2040}]|[\u{2070}-\u{218F}]' +
			'|[\u{2C00}-\u{2FEF}]|[\u{3001}-\u{D7FF}]' +
			'|[\u{F900}-\u{FDCF}]|[\u{FDF0}-\u{FFFD}]|[\u{10000}-\u{EFFFF}]';

		const PCEN = new RegExp(`^[a-z](${PCENChar})*-(${PCENChar})*$`, 'u');

		const forbiddenNames = [
			'annotation-xml',
			'color-profile',
			'font-face',
			'font-face-src',
			'font-face-uri',
			'font-face-format',
			'font-face-name',
			'missing-glyph'
		];
		return PCEN.test(tagName) && !forbiddenNames.includes(tagName);
	}

	/**
	 * Defines a custom element class.
	 *
	 * @param tagName Tag name of element.
	 * @param elementClass Element class.
	 * @param [options] Options.
	 * @param options.extends
	 */
	public define(
		tagName: string,
		elementClass: typeof HTMLElement,
		options?: { extends: string }
	): void {
		const upperTagName = tagName.toUpperCase();

		if (!upperTagName.includes('-')) {
			throw new DOMException(
				"Failed to execute 'define' on 'CustomElementRegistry': \"" +
					tagName +
					'" is not a valid custom element name.'
			);
		}

		this._registry[upperTagName] = {
			elementClass,
			extends: options && options.extends ? options.extends.toLowerCase() : null
		};

		// ObservedAttributes should only be called once by CustomElementRegistry (see #117)
		if (elementClass.prototype.attributeChangedCallback) {
			elementClass._observedAttributes = elementClass.observedAttributes;
		}

		if (this._callbacks[upperTagName]) {
			const callbacks = this._callbacks[upperTagName];
			delete this._callbacks[upperTagName];
			for (const callback of callbacks) {
				callback();
			}
		}
	}

	/**
	 * Returns a defined element class.
	 *
	 * @param tagName Tag name of element.
	 * @param HTMLElement Class defined.
	 */
	public get(tagName: string): typeof HTMLElement {
		const upperTagName = tagName.toUpperCase();
		return this._registry[upperTagName] ? this._registry[upperTagName].elementClass : undefined;
	}

	/**
	 * Upgrades a custom element directly, even before it is connected to its shadow root.
	 *
	 * Not implemented yet.
	 *
	 * @param _root Root node.
	 */
	public upgrade(_root: Node): void {
		// Do nothing
	}

	/**
	 * When defined.
	 *
	 * @param tagName Tag name of element.
	 * @returns Promise.
	 */
	public whenDefined(tagName: string): Promise<void> {
		const upperTagName = tagName.toUpperCase();
		if (this.get(upperTagName)) {
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			this._callbacks[upperTagName] = this._callbacks[upperTagName] || [];
			this._callbacks[upperTagName].push(resolve);
		});
	}

	/**
	 * Reverse lookup searching for tagName by given element class.
	 *
	 * @param elementClass Class constructor.
	 * @returns First found Tag name or `null`.
	 */
	public getName(elementClass: typeof HTMLElement): string | null {
		const tagName = Object.keys(this._registry).find(
			(k) => this._registry[k].elementClass === elementClass
		);
		return !!tagName ? tagName : null;
	}
}
