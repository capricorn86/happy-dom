import DOMException from '../../exception/DOMException';
import Element from './Element';
import IDOMTokenList from './IDOMTokenList';

/**
 * DOM Token List.
 */
export default class DOMTokenList implements IDOMTokenList<string> {
	private _ownerElement: Element;
	private _list: string[];
	/**
	 * Adds class names.
	 *
	 * @param ownerElement Owner element.
	 */
	constructor(ownerElement: Element) {
		this._ownerElement = ownerElement;
	}

	/**
	 * Get ClassName.
	 *
	 * @param index Index.
	 * */
	public item(index: number): string {
		this._refreshListFromClass();
		return index >= 0 && this._list[index] ? this._list[index] : null;
	}

	/**
	 * Replace Token.
	 *
	 * @param token Token.
	 * @param newToken NewToken.
	 */
	public replace(token: string, newToken: string): boolean {
		if (!this.contains(token)) {
			return false;
		}
		const index = this._list.indexOf(token);
		this._list[index] = newToken;
		const value = this._list ? this._list.join(' ') : '';
		this._ownerElement.setAttribute('class', value);
		return true;
	}

	/**
	 * Supports.
	 *
	 * @param token Token.
	 */
	public supports(token: string): boolean {
		// TODO May IT IN ERROR.
		throw new DOMException(
			`Failed to execute '${token}' on 'DOMTokenList': DOMTokenList has no supported tokens.`,
			'TypeError'
		);
	}
	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 *
	 */
	public values(): IterableIterator<string> {
		this._refreshListFromClass();
		return this._list.values();
	}
	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 *
	 *
	 */
	public entries(): IterableIterator<[number, string]> {
		this._refreshListFromClass();
		return this._list.entries();
	}
	/**
	 * Executes a provided callback function once for each DOMTokenList element.
	 *
	 * @param callback
	 * @param thisArg
	 */
	public forEach(callback: (currentValue, currentIndex, listObj) => void, thisArg?: this): void {
		this._refreshListFromClass();
		return this._list.forEach(callback, thisArg);
	}
	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 */
	public keys(): IterableIterator<number> {
		this._refreshListFromClass();
		return this._list.keys();
	}

	/**
	 * Adds class names.
	 *
	 * @param classNames Class names.
	 */
	public add(...classNames: string[]): void {
		this._refreshListFromClass();
		for (const className of classNames) {
			if (!this._list.includes(className)) {
				if (className.includes(' ')) {
					throw new DOMException(
						`Failed to execute 'add' on 'DOMTokenList': The token provided ('${className}') contains HTML space characters, which are not valid in tokens.`
					);
				}
				this._list.push(className);
			}
		}
		this._list = Array.from(new Set(this._list));
		const value = this._list ? this._list.join(' ') : '';
		this._ownerElement.setAttribute('class', value);
	}

	/**
	 * Removes class names.
	 *
	 * @param classNames Class names.
	 */
	public remove(...classNames: string[]): void {
		this._refreshListFromClass();
		for (const className of classNames) {
			const index = this._list.indexOf(className);
			if (index !== -1) {
				this._list.splice(index, 1);
			}
		}
		const value = this._list ? this._list.join(' ') : '';
		this._ownerElement.setAttribute('class', value);
	}

	/**
	 * Check if the list contains a class.
	 *
	 * @param className Class name.
	 * @returns TRUE if it contains.
	 */
	public contains(className: string): boolean {
		this._refreshListFromClass();
		return this._list.includes(className);
	}

	/**
	 * Toggle a class name.
	 *
	 * @param className A string representing the class name you want to toggle.
	 * @param force If included, turns the toggle into a one way-only operation. If set to `false`, then class name will only be removed, but not added. If set to `true`, then class name will only be added, but not removed.
	 * @returns A boolean value, `true` or `false`, indicating whether class name is in the list after the call or not.
	 */
	public toggle(className: string, force?: boolean): boolean {
		let shouldAdd: boolean;
		if (force !== undefined) {
			shouldAdd = force;
		} else {
			shouldAdd = !this.contains(className);
		}

		if (shouldAdd) {
			this.add(className);
			return true;
		}

		this.remove(className);
		return false;
	}

	/**
	 * Refresh list from class.
	 */
	private _refreshListFromClass(): void {
		const attr = this._ownerElement.getAttribute('class');
		this._list = attr ? Array.from(new Set(attr.split(' '))) : [];
	}

	/**
	 * Set Value.
	 */
	public set value(value: string) {
		this._ownerElement.setAttribute('class', value);
		this._list = value ? Array.from(new Set(value.split(' '))) : [];
	}

	/**
	 * Get Value.
	 */
	public get value(): string {
		this._refreshListFromClass();
		return this._list ? this._list.join(' ') : '';
	}

	/**
	 * Get Length.
	 */
	public get length(): number {
		this._refreshListFromClass();
		return this._list.length;
	}
}
