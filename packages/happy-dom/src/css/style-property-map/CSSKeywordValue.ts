/**
 * CSSKeywordValue interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSKeywordValue
 */
export default class CSSKeywordValue {
	#value: string;

	/**
	 * Constructor.
	 *
	 * @param value Value..
	 */
	constructor(value: string) {
		this.#value = value;
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this.#value;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.#value = value;
	}
}
