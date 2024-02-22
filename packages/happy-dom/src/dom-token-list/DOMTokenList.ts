import Element from '../nodes/element/Element.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IDOMTokenList from './IDOMTokenList.js';

const ATTRIBUTE_SPLIT_REGEXP = /[\t\f\n\r ]+/;

/**
 * DOM Token List.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList.
 */
export default class DOMTokenList implements IDOMTokenList {
	#length = 0;
	#ownerElement: Element;
	#attributeName: string;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 * @param attributeName Attribute name.
	 */
	constructor(ownerElement: Element, attributeName) {
		this.#ownerElement = ownerElement;
		this.#attributeName = attributeName;
		this[PropertySymbol.updateIndices]();
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this.#length;
	}

	/**
	 * Set value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.#ownerElement.setAttribute(this.#attributeName, value);
	}

	/**
	 * Get value.
	 */
	public get value(): string {
		return this.#ownerElement.getAttribute(this.#attributeName);
	}

	/**
	 * Get ClassName.
	 *
	 * @param index Index.
	 * */
	public item(index: number | string): string {
		index = typeof index === 'number' ? index : 0;
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Replace Token.
	 *
	 * @param token Token.
	 * @param newToken NewToken.
	 */
	public replace(token: string, newToken: string): boolean {
		const list = this.#getTokenList();
		const index = list.indexOf(token);
		if (index === -1) {
			return false;
		}
		list[index] = newToken;
		this.#ownerElement.setAttribute(this.#attributeName, list.join(' '));
		return true;
	}

	/**
	 * Supports.
	 *
	 * @param _token Token.
	 */
	public supports(_token: string): boolean {
		return false;
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 */
	public values(): IterableIterator<string> {
		return this.#getTokenList().values();
	}

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 */
	public entries(): IterableIterator<[number, string]> {
		return this.#getTokenList().entries();
	}

	/**
	 * Executes a provided callback function once for each DOMTokenList element.
	 *
	 * @param callback
	 * @param thisArg
	 */
	public forEach(callback: (currentValue, currentIndex, listObj) => void, thisArg?: this): void {
		return this.#getTokenList().forEach(callback, thisArg);
	}

	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 */
	public keys(): IterableIterator<number> {
		return this.#getTokenList().keys();
	}

	/**
	 * Adds tokens.
	 *
	 * @param tokens Tokens.
	 */
	public add(...tokens: string[]): void {
		const list = this.#getTokenList();

		for (const token of tokens) {
			const index = list.indexOf(token);
			if (index === -1) {
				list.push(token);
			} else {
				list[index] = token;
			}
		}

		this.#ownerElement.setAttribute(this.#attributeName, list.join(' '));
	}

	/**
	 * Removes tokens.
	 *
	 * @param tokens Tokens.
	 */
	public remove(...tokens: string[]): void {
		const list = this.#getTokenList();

		for (const token of tokens) {
			const index = list.indexOf(token);
			if (index !== -1) {
				list.splice(index, 1);
			}
		}

		this.#ownerElement.setAttribute(this.#attributeName, list.join(' '));
	}

	/**
	 * Check if the list contains a class.
	 *
	 * @param className Class name.
	 * @returns TRUE if it contains.
	 */
	public contains(className: string): boolean {
		const list = this.#getTokenList();
		return list.includes(className);
	}

	/**
	 * Toggle a class name.
	 *
	 * @param token A string representing the class name you want to toggle.
	 * @param [force] If included, turns the toggle into a one way-only operation. If set to `false`, then class name will only be removed, but not added. If set to `true`, then class name will only be added, but not removed.
	 * @returns A boolean value, `true` or `false`, indicating whether class name is in the list after the call or not.
	 */
	public toggle(token: string, force?: boolean): boolean {
		let shouldAdd: boolean;

		if (force !== undefined) {
			shouldAdd = force;
		} else {
			shouldAdd = !this.contains(token);
		}

		if (shouldAdd) {
			this.add(token);
			return true;
		}

		this.remove(token);

		return false;
	}

	/**
	 * Updates indices.
	 */
	public [PropertySymbol.updateIndices](): void {
		const list = this.#getTokenList();

		for (let i = list.length - 1, max = this.length; i < max; i++) {
			delete this[i];
		}

		for (let i = 0, max = list.length; i < max; i++) {
			this[i] = list[i];
		}

		this.#length = list.length;
	}

	/**
	 * Returns token list from attribute value.
	 *
	 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
	 */
	#getTokenList(): string[] {
		const attr = this.#ownerElement.getAttribute(this.#attributeName);
		if (!attr) {
			return [];
		}
		// It is possible to make this statement shorter by using Array.from() and Set, but this is faster when comparing using a bench test.
		const list = [];
		for (const item of attr.trim().split(ATTRIBUTE_SPLIT_REGEXP)) {
			if (!list.includes(item)) {
				list.push(item);
			}
		}
		return list;
	}

	/**
	 * Returns DOMTokenList value.
	 */
	public toString(): string {
		return this.value || '';
	}
}
