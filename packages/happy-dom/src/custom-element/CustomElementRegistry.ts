import HTMLElement from '../nodes/basic/html-element/HTMLElement';

/**
 * Custom elements registry.
 */
export default class CustomElementRegistry {
	private _callbacks: { [k: string]: (() => void)[] } = {};
	private _registry = {};

	/**
	 * Defines a custom element class.
	 *
	 * @param tagName Tag name of element.
	 * @param elementClass Element class.
	 */
	public define(tagName: string, elementClass: typeof HTMLElement): void {
		if (!tagName.includes('-')) {
			throw new Error(
				"Failed to execute 'define' on 'CustomElementRegistry': \"" +
					tagName +
					'" is not a valid custom element name.'
			);
		}

		this._registry[tagName.toLowerCase()] = elementClass;

		if (this._callbacks[tagName]) {
			for (const callback of this._callbacks[tagName]) {
				callback();
			}
			delete this._callbacks[tagName];
		}
	}

	/**
	 * Returns a defined element class.
	 *
	 * @param tagName Tag name of element.
	 * @param HTMLElement class defined.
	 */
	public get(tagName: string): typeof HTMLElement {
		return this._registry[tagName.toLowerCase()];
	}

	/**
	 * Upgrades it.
	 */
	public upgrade(): void {}

	/**
	 * When defined.
	 *
	 * @param tagName Tag name of element.
	 * @returns Promise.
	 */
	public async whenDefined(tagName: string): Promise<void> {
		if (this.get(tagName)) {
			return Promise.resolve();
		}
		return new Promise(resolve => {
			this._callbacks[tagName] = this._callbacks[tagName] || [];
			this._callbacks[tagName].push(resolve);
		});
	}
}
