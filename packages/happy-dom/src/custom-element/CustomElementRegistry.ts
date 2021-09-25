import DOMException from '../exception/DOMException';
import HTMLElement from '../nodes/html-element/HTMLElement';
import Node from '../nodes/node/Node';

/**
 * Custom elements registry.
 */
export default class CustomElementRegistry {
	public _registry: { [k: string]: { elementClass: typeof HTMLElement; extends: string } } = {};
	private _callbacks: { [k: string]: (() => void)[] } = {};

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
		const name = tagName.toLowerCase();
		if (!name.includes('-')) {
			throw new DOMException(
				"Failed to execute 'define' on 'CustomElementRegistry': \"" +
					name +
					'" is not a valid custom element name.'
			);
		}

		this._registry[name] = {
			elementClass,
			extends: options && options.extends ? options.extends.toLowerCase() : null
		};

		// ObservedAttributes should only be called once by CustomElementRegistry (see #117)
		if (elementClass.prototype.attributeChangedCallback) {
			elementClass._observedAttributes = elementClass.observedAttributes;
		}

		if (this._callbacks[name]) {
			for (const callback of this._callbacks[name]) {
				callback();
			}
			delete this._callbacks[name];
		}
	}

	/**
	 * Returns a defined element class.
	 *
	 * @param tagName Tag name of element.
	 * @param HTMLElement Class defined.
	 */
	public get(tagName: string): typeof HTMLElement {
		const name = tagName.toLowerCase();
		return this._registry[name] ? this._registry[name].elementClass : undefined;
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
		const name = tagName.toLowerCase();
		if (this.get(name)) {
			return Promise.resolve();
		}
		return new Promise(resolve => {
			this._callbacks[name] = this._callbacks[name] || [];
			this._callbacks[name].push(resolve);
		});
	}
}
