import Element from './Element';

/**
 * Class list.
 */
export default class ClassList {
	private ownerElement: Element;

	/**
	 * Adds class names.
	 *
	 * @param {Element} ownerElement Owner element.
	 */
	constructor(ownerElement: Element) {
		this.ownerElement = ownerElement;
	}

	/**
	 * Adds class names.
	 *
	 * @param {string[]} classNames Class names.
	 */
	public add(...classNames: string[]): void {
		const attr = this.ownerElement.getAttribute('class');
		const list = attr ? attr.split(' ') : [];
		for (const className of classNames) {
			if (!list.includes(className)) {
				list.push(className);
			}
		}
		this.ownerElement.setAttribute('class', list.join(' '));
	}

	/**
	 * Adds class names.
	 *
	 * @param {string[]} classNames Class names.
	 */
	public remove(...classNames: string[]): void {
		const attr = this.ownerElement.getAttribute('class');
		const list = attr ? attr.split(' ') : [];
		for (const className of classNames) {
			const index = list.indexOf(className);
			if (index !== -1) {
				list.splice(index, 1);
			}
		}
		this.ownerElement.setAttribute('class', list.join(' '));
	}

	/**
	 * Check if the list contains a class.
	 *
	 * @param {string} className Class name.
	 * @return {boolean} TRUE if it contains.
	 */
	public contains(className: string): boolean {
		const attr = this.ownerElement.getAttribute('class');
		const list = attr ? attr.split(' ') : [];
		return list.includes(className);
	}
}
