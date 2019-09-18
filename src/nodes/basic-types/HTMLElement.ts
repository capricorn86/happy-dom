import Element from './Element';

/**
 * HTMLElement.
 */
export default class HTMLElement extends Element {
	protected static _observedPropertyAttributes = ['tabIndex'];
	public style: object = {};
	public tabIndex: number = 0;

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
        if(observedPropertyAttributes.includes(lowerName.toLowerCase())) {
			const property = this.kebabToCamelCase(name);
            this[property] = typeof this[property] === 'boolean' ? value !== null : String(value);
        }
    }

	/**
	 * Sets raw attributes.
	 *
     * @override
	 * @param {string} rawAttributes Raw attributes.
	 */
	public setRawAttributes(rawAttributes: string): void {
        super.setRawAttributes(rawAttributes);
        if(rawAttributes.trim()) {
            this.defineInitialProperties();
        }
	}
    
	/**
	 * Defines initial properties.
	 */
    private defineInitialProperties(): void {
		const observedPropertyAttributes = (<typeof HTMLElement>this.constructor)._observedPropertyAttributes;
		
        for(const name of observedPropertyAttributes) {
            const attribute = this.attributesMap[name];
            if(attribute !== null) {
				const property = this.kebabToCamelCase(name);
				this[property] = typeof this[property] === 'boolean' ? true : attribute;
            }
        }
    }
    
	/**
	 * Kebab case to camel case.
	 *
	 * @param {string} string String to convert.
	 * @returns {string} Text as camel case.
	 */
	private kebabToCamelCase(string) {
		return string.replace(/-([a-z])/g, g => g[1].toUpperCase());
    }
}
