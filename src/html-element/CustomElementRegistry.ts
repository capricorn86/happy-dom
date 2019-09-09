import HTMLElement from '../nodes/HTMLElement';

/**
 * Custom elements registry.
 */
export default class CustomElementRegistry {
	public registry = {};
	private callbacks: { [k: string]: (() => void)[] } = {};

	/**
	 * Defines a custom element class.
	 *
	 * @param {string} tagName Tag name of element.
	 * @param {typeof HTMLElement} elementClass Element class.
	 */
	public define(tagName: string, elementClass: typeof HTMLElement): void {
		this.registry[tagName.toLowerCase()] = elementClass;
		if (this.callbacks[tagName]) {
			for (const callback of this.callbacks[tagName]) {
				callback();
			}
			delete this.callbacks[tagName];
		}
	}

	/**
	 * Returns a defined element class.
	 *
	 * @param {string} tagName Tag name of element.
	 * @param {typeof HTMLElement} HTMLElement class defined.
	 */
	public get(tagName: string): typeof HTMLElement {
		return this.registry[tagName.toLowerCase()];
	}

	/**
	 * Upgrades it.
	 */
	public upgrade(): void {}

	/**
	 * When defined.
	 *
	 * @param {string} tagName Tag name of element.
	 * @return {Promise<void>} Promise.
	 */
	public whenDefined(tagName: string): Promise<void> {
		if (this.get(tagName)) {
			return Promise.resolve();
		}
		return new Promise(resolve => {
			this.callbacks[tagName] = this.callbacks[tagName] || [];
			this.callbacks[tagName].push(resolve);
		});
	}
}
