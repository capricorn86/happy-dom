import DOMException from '../../exception/DOMException';
import Element from './Element';

/**
 * Class list.
 */
export default class ClassList {
	private _ownerElement: Element;

	/**
	 * Adds class names.
	 *
	 * @param ownerElement Owner element.
	 */
	constructor(ownerElement: Element) {
		this._ownerElement = ownerElement;
	}

	/**
	 * Adds class names.
	 *
	 * @param classNames Class names.
	 */
	public add(...classNames: string[]): void {
		const attr = this._ownerElement.getAttribute('class');
		const list = attr ? attr.split(' ') : [];
		for (const className of classNames) {
			if (!list.includes(className)) {
				if (className.includes(' ')) {
					throw new DOMException(
						`Failed to execute 'add' on 'DOMTokenList': The token provided ('${className}') contains HTML space characters, which are not valid in tokens.`
					);
				}
				list.push(className);
			}
		}
		this._ownerElement.setAttribute('class', list.join(' '));
	}

	/**
	 * Adds class names.
	 *
	 * @param classNames Class names.
	 */
	public remove(...classNames: string[]): void {
		const attr = this._ownerElement.getAttribute('class');
		const list = attr ? attr.split(' ') : [];
		for (const className of classNames) {
			const index = list.indexOf(className);
			if (index !== -1) {
				list.splice(index, 1);
			}
		}
		this._ownerElement.setAttribute('class', list.join(' '));
	}

	/**
	 * Check if the list contains a class.
	 *
	 * @param className Class name.
	 * @returns TRUE if it contains.
	 */
	public contains(className: string): boolean {
		const attr = this._ownerElement.getAttribute('class');
		const list = attr ? attr.split(' ') : [];
		return list.includes(className);
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
}
