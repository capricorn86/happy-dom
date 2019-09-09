import Element from '../nodes/Element';

const ATTRIBUTE_REGEXP = /\[([a-zA-Z_$\-]*)=([^\]]*)\]/g;
const CLASS_REGEXP = /\.[^\[(]*/g;

export default class SelectorItem {
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
		this.isID = part.startsWith('#');
		this.isAttribute = !this.isID && ATTRIBUTE_REGEXP.test(part);
		this.isClass = !this.isID && CLASS_REGEXP.test(part);
		this.isTagName = !this.isID && !this.isAttribute && !this.isClass;
		this.part = part;
		this.id = this.isID ? this.part.replace('#', '') : null;
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

		// ID Match
		if (this.isID) {
			return this.id === element.id;
		}

		// Attribute match
		if (this.isAttribute) {
			const attributeRegexp = new RegExp(ATTRIBUTE_REGEXP, 'g');

			while ((match = attributeRegexp.exec(part))) {
				if (element.attributesMap[match[1]] !== match[2].replace(/"/g, '')) {
					return false;
				}
				part = part.replace(match[0], '');
			}
		}

		// Class match
		if (this.isClass) {
			const classRegexp = new RegExp(CLASS_REGEXP, 'g');

			while ((match = classRegexp.exec(part))) {
				if (element.attributesMap[match[1]] !== match[2].replace(/"/g, '')) {
					return false;
				}
				part = part.replace(match[0], '');
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
