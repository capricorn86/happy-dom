import DOMException from '../exception/DOMException';
import Element from '../nodes/element/Element';
import IDOMTokenList from './IDOMTokenList';

/**
 * DOM Token List.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList.
 */
export default class DOMTokenList implements IDOMTokenList {
	public readonly length = 0;
	private _ownerElement: Element;
	private _attributeName: string;

	/**
	 * Constructor.
	 *
	 * @param ownerElement Owner element.
	 * @param attributeName Attribute name.
	 */
	constructor(ownerElement: Element, attributeName) {
		this._ownerElement = ownerElement;
		this._attributeName = attributeName;
		this._updateIndices();
	}

	/**
	 * Set value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this._ownerElement.setAttributeNS(null, this._attributeName, value);
	}

	/**
	 * Get value.
	 */
	public get value(): string {
		return this._ownerElement.getAttributeNS(null, this._attributeName);
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
		const attr = this._ownerElement.getAttributeNS(null, this._attributeName);
		const list = attr ? attr.split(' ') : [];
		const index = list.indexOf(token);
		if (index === -1) {
			return false;
		}
		list[index] = newToken;
		this._ownerElement.setAttributeNS(null, this._attributeName, list.join(' '));
		return true;
	}

	/**
	 * Supports.
	 *
	 * @param token Token.
	 */
	public supports(token: string): boolean {
		// TODO: Only implemented for classList, which does not have any supported tokens
		throw new DOMException(
			`Failed to execute '${token}' on 'DOMTokenList': DOMTokenList has no supported tokens.`,
			'TypeError'
		);
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 */
	public values(): IterableIterator<string> {
		const attr = this._ownerElement.getAttributeNS(null, this._attributeName);
		return (attr ? attr.split(' ') : []).values();
	}

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 */
	public entries(): IterableIterator<[number, string]> {
		const attr = this._ownerElement.getAttributeNS(null, this._attributeName);
		return (attr ? attr.split(' ') : []).entries();
	}

	/**
	 * Executes a provided callback function once for each DOMTokenList element.
	 *
	 * @param callback
	 * @param thisArg
	 */
	public forEach(callback: (currentValue, currentIndex, listObj) => void, thisArg?: this): void {
		const attr = this._ownerElement.getAttributeNS(null, this._attributeName);
		return (attr ? attr.split(' ') : []).forEach(callback, thisArg);
	}

	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 */
	public keys(): IterableIterator<number> {
		const attr = this._ownerElement.getAttributeNS(null, this._attributeName);
		return (attr ? attr.split(' ') : []).keys();
	}

	/**
	 * Adds tokens.
	 *
	 * @param tokens Tokens.
	 */
	public add(...tokens: string[]): void {
		const attr = this._ownerElement.getAttributeNS(null, this._attributeName);
		const list = attr ? attr.split(' ') : [];

		for (const token of tokens) {
			const index = list.indexOf(token);
			if (index === -1) {
				list.push(token);
			} else {
				list[index] = token;
			}
		}

		this._ownerElement.setAttributeNS(null, this._attributeName, list.join(' '));
	}

	/**
	 * Removes tokens.
	 *
	 * @param tokens Tokens.
	 */
	public remove(...tokens: string[]): void {
		const attr = this._ownerElement.getAttributeNS(null, this._attributeName);
		const list = attr ? attr.split(' ') : [];

		for (const token of tokens) {
			const index = list.indexOf(token);
			if (index !== -1) {
				list.splice(index, 1);
			}
		}

		this._ownerElement.setAttributeNS(null, this._attributeName, list.join(' '));
	}

	/**
	 * Check if the list contains a class.
	 *
	 * @param className Class name.
	 * @returns TRUE if it contains.
	 */
	public contains(className: string): boolean {
		const attr = this._ownerElement.getAttributeNS(null, this._attributeName);
		return (attr ? attr.split(' ') : []).includes(className);
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
	public _updateIndices(): void {
		const attr = this._ownerElement.getAttribute('class');
		const list = attr ? Array.from(new Set(attr.split(' '))) : [];

		for (let i = list.length - 1, max = this.length; i < max; i++) {
			delete this[i];
		}

		for (let i = 0, max = list.length; i < max; i++) {
			this[i] = list[i];
		}

		(<number>this.length) = list.length;
	}
}
