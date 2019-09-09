import Element from './Element';

/**
 * HTMLElement.
 */
export default class HTMLElement extends Element {
	public style: object = {};

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
}
