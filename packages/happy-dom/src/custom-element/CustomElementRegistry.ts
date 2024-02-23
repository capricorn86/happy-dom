import DOMException from '../exception/DOMException.js';
import * as PropertySymbol from '../PropertySymbol.js';
import HTMLElement from '../nodes/html-element/HTMLElement.js';
import Node from '../nodes/node/Node.js';

/**
 * Custom elements registry.
 */
export default class CustomElementRegistry {
	public [PropertySymbol.registry]: {
		[k: string]: { elementClass: typeof HTMLElement; extends: string };
	} = {};
	public [PropertySymbol.registedClass]: Map<typeof HTMLElement, string> = new Map();
	public [PropertySymbol.callbacks]: { [k: string]: (() => void)[] } = {};

	/**
	 * Defines a custom element class.
	 *
	 * @param name Tag name of element.
	 * @param elementClass Element class.
	 * @param [options] Options.
	 * @param [options.extends] Extends tag name.
	 */
	public define(
		name: string,
		elementClass: typeof HTMLElement,
		options?: { extends?: string }
	): void {
		if (!this.#isValidCustomElementName(name)) {
			throw new DOMException(
				`Failed to execute 'define' on 'CustomElementRegistry': "${name}" is not a valid custom element name`
			);
		}

		if (this[PropertySymbol.registry][name]) {
			throw new DOMException(
				`Failed to execute 'define' on 'CustomElementRegistry': the name "${name}" has already been used with this registry`
			);
		}

		if (this[PropertySymbol.registedClass].has(elementClass)) {
			throw new DOMException(
				"Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry"
			);
		}

		this[PropertySymbol.registry][name] = {
			elementClass,
			extends: options && options.extends ? options.extends.toLowerCase() : null
		};
		this[PropertySymbol.registedClass].set(elementClass, name);

		// ObservedAttributes should only be called once by CustomElementRegistry (see #117)
		if (elementClass.prototype.attributeChangedCallback) {
			elementClass[PropertySymbol.observedAttributes] = elementClass.observedAttributes;
		}

		if (this[PropertySymbol.callbacks][name]) {
			const callbacks = this[PropertySymbol.callbacks][name];
			delete this[PropertySymbol.callbacks][name];
			for (const callback of callbacks) {
				callback();
			}
		}
	}

	/**
	 * Returns a defined element class.
	 *
	 * @param name Tag name of element.
	 * @returns HTMLElement Class defined or undefined.
	 */
	public get(name: string): typeof HTMLElement | undefined {
		return this[PropertySymbol.registry][name]?.elementClass;
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
	 * @param name Tag name of element.
	 */
	public whenDefined(name: string): Promise<void> {
		if (!this.#isValidCustomElementName(name)) {
			return Promise.reject(new DOMException(`Invalid custom element name: "${name}"`));
		}
		if (this.get(name)) {
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			this[PropertySymbol.callbacks][name] = this[PropertySymbol.callbacks][name] || [];
			this[PropertySymbol.callbacks][name].push(resolve);
		});
	}

	/**
	 * Reverse lookup searching for name by given element class.
	 *
	 * @param elementClass Class constructor.
	 * @returns Found tag name or `null`.
	 */
	public getName(elementClass: typeof HTMLElement): string | null {
		return this[PropertySymbol.registedClass].get(elementClass) || null;
	}

	/**
	 * Validates the correctness of custom element tag names.
	 *
	 * @param name Custom element tag name.
	 * @returns True, if tag name is standard compliant.
	 */
	#isValidCustomElementName(name: string): boolean {
		// Validation criteria based on:
		// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
		const PCENChar =
			'[-_.]|[0-9]|[a-z]|\u{B7}|[\u{C0}-\u{D6}]|[\u{D8}-\u{F6}]' +
			'|[\u{F8}-\u{37D}]|[\u{37F}-\u{1FFF}]' +
			'|[\u{200C}-\u{200D}]|[\u{203F}-\u{2040}]|[\u{2070}-\u{218F}]' +
			'|[\u{2C00}-\u{2FEF}]|[\u{3001}-\u{D7FF}]' +
			'|[\u{F900}-\u{FDCF}]|[\u{FDF0}-\u{FFFD}]|[\u{10000}-\u{EFFFF}]';

		const PCEN = new RegExp(`^[a-z](${PCENChar})*-(${PCENChar})*$`, 'u');

		const reservedNames = [
			'annotation-xml',
			'color-profile',
			'font-face',
			'font-face-src',
			'font-face-uri',
			'font-face-format',
			'font-face-name',
			'missing-glyph'
		];
		return PCEN.test(name) && !reservedNames.includes(name);
	}
}
