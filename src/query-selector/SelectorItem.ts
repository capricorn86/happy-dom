import Element from '../nodes/basic-types/element/Element';

const ATTRIBUTE_REGEXP = /\[([a-zA-Z_$\-]*)=([^\]]*)\]/g;
const CLASS_REGEXP = /\.([^\[(.]*)/g;

export default class SelectorItem {
	public isAll: boolean;
	public isID: boolean;
	public isAttribute: boolean;
	public isClass: boolean;
	public isTagName: boolean;
	private part: string;
	private id: string;

	/**
	 * Constructor.
	 *
	 * @param {string} part Part.
	 */
	constructor(part: string) {
		this.isAll = part === '*';
		this.isID = !this.isAll ? part.startsWith('#') : false;
		this.isAttribute = !this.isAll && !this.isID && ATTRIBUTE_REGEXP.test(part);
		this.isClass = !this.isAll && !this.isID && new RegExp(CLASS_REGEXP, 'g').test(part);
		this.isTagName = !this.isAll && !this.isID && !this.isAttribute && !this.isClass;
		this.part = part;
		this.id = !this.isAll && this.isID ? this.part.replace('#', '') : null;
	}

	/**
	 * Matches a selector part against an element.
	 *
	 * @param element HTML element.
	 * @return TRUE if matching.
	 */
	public match(element: Element): boolean {
		let part = this.part;
		let match;

		// Is all (*)
		if (this.isAll) {
			return true;
		}

		// ID Match
		if (this.isID) {
			return this.id === element.id;
		}

		// Attribute match
		if (this.isAttribute) {
			const attributeRegexp = new RegExp(ATTRIBUTE_REGEXP, 'g');

			while ((match = attributeRegexp.exec(part))) {
				if (element._attributesMap[match[1]] !== match[2].replace(/"/g, '')) {
					return false;
				}
			}
		}

		// Class match
		if (this.isClass) {
			const classRegexp = new RegExp(CLASS_REGEXP, 'g');

			while ((match = classRegexp.exec(part))) {
				if (!element.classList.contains(match[1])) {
					return false;
				}
			}
		}

		// Tag name match
		if (this.isTagName) {
			if (part.toUpperCase() !== element.tagName) {
				return false;
			}
		}

		return true;
	}
}
