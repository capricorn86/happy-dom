import Element from '../element/Element';

/**
 * HTMLElement.
 */
export default class HTMLElement extends Element {
	protected static _observedPropertyAttributes: { [k: string]: string } = { tabindex: 'tabIndex' };
	public style: object = {};
	public tabIndex: number = 0;
	public offsetHeight = 0;
	public offsetWidth = 0;
	public offsetLeft = 0;
	public offsetTop = 0;

	/**
	 * Returns inner text.
	 *
	 * @return {string} Text.
	 */
	public get innerText(): string {
		return this.textContent;
	}

	/**
	 * Sets inner text.
	 *
	 * @param {string} text Text.
	 */
	public set innerText(text: string) {
		this.textContent = text;
	}

	/**
	 * Blur.
	 */
	public blur(): void {}

	/**
	 * Click.
	 */
	public click(): void {}

	/**
	 * Focus.
	 */
	public focus(): void {}

	/**
	 * Sets an attribute.
	 *
	 * @override
	 * @param {string} name Name.
	 * @param {string} value Value.
	 */
	public setAttribute(name: string, value: string): void {
		const lowerName = name.toLowerCase();
		super.setAttribute(lowerName, value);
		const observedPropertyAttributes = (<typeof HTMLElement>this.constructor)._observedPropertyAttributes;
		const observedAttributes = Object.keys(observedPropertyAttributes);
		if (value !== null && value !== undefined && observedAttributes.includes(lowerName)) {
			const property = observedPropertyAttributes[lowerName];
			this[property] = typeof this[property] === 'boolean' ? value !== null : String(value);
		}
	}

	/**
	 * Sets raw attributes.
	 *
	 * @override
	 * @param {string} rawAttributes Raw attributes.
	 */
	public _setRawAttributes(rawAttributes: string): void {
		super._setRawAttributes(rawAttributes);
		if (rawAttributes.trim()) {
			this._defineInitialProperties();
		}
	}

	/**
	 * Defines initial properties.
	 */
	private _defineInitialProperties(): void {
		const observedPropertyAttributes = (<typeof HTMLElement>this.constructor)._observedPropertyAttributes;

		for (const name of Object.keys(observedPropertyAttributes)) {
			const attribute = this._attributesMap[name];

			if (attribute !== null && attribute !== undefined) {
				const property = observedPropertyAttributes[name];
				switch (typeof this[property]) {
					case 'boolean':
						this[property] = true;
					case 'number':
						this[property] = parseFloat(attribute);
					default:
						this[property] = attribute;
				}
			}
		}
	}
}
