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
}
