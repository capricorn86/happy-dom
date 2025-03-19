import CSSMediaRule from './rules/CSSMediaRule.js';
import * as PropertySymbol from '../PropertySymbol.js';
import ClassMethodBinder from '../utilities/ClassMethodBinder.js';

const MEDIUM_REGEXP = /\s*,\s*/;

/**
 * MediaList interface.
 */
export default class MediaList {
	public [PropertySymbol.cssRule]: CSSMediaRule;

	/**
	 *
	 * @param illegalConstructorSymbol
	 * @param cssRule
	 */
	constructor(illegalConstructorSymbol: Symbol, cssRule: CSSMediaRule) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		this[PropertySymbol.cssRule] = cssRule;

		const methodBinder = new ClassMethodBinder(this, [MediaList]);

		return new Proxy(this, {
			get: (target, property) => {
				if (property in target || typeof property === 'symbol') {
					methodBinder.bind(property);
					return target[property];
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return cssRule[PropertySymbol.conditionText].split(MEDIUM_REGEXP)[index];
				}
			},
			set(target, property, newValue): boolean {
				methodBinder.bind(property);
				if (property in target || typeof property === 'symbol') {
					target[property] = newValue;
					return true;
				}
				return true;
			},
			deleteProperty(target, property): boolean {
				if (property in target || typeof property === 'symbol') {
					delete target[property];
					return true;
				}
				return true;
			},
			ownKeys(): string[] {
				return Object.keys(cssRule[PropertySymbol.conditionText].split(MEDIUM_REGEXP));
			},
			has(target, property): boolean {
				if (typeof property === 'symbol') {
					return false;
				}

				if (property in target) {
					return true;
				}

				const index = Number(property);
				return (
					!isNaN(index) &&
					index >= 0 &&
					index < cssRule[PropertySymbol.conditionText].split(MEDIUM_REGEXP).length
				);
			},
			defineProperty(target, property, descriptor): boolean {
				methodBinder.preventBinding(property);

				if (property in target) {
					Object.defineProperty(target, property, descriptor);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor {
				if (property in target || typeof property === 'symbol') {
					return;
				}

				const index = Number(property);
				const items = cssRule[PropertySymbol.conditionText].split(MEDIUM_REGEXP);

				if (!isNaN(index) && items[index]) {
					return {
						value: items[index],
						writable: false,
						enumerable: true,
						configurable: true
					};
				}
			}
		});
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.cssRule][PropertySymbol.conditionText].split(MEDIUM_REGEXP).length;
	}

	/**
	 * Returns media text.
	 *
	 * @returns Media text.
	 */
	public get mediaText(): string {
		return this[PropertySymbol.cssRule][PropertySymbol.conditionText];
	}

	/**
	 * Sets media text.
	 *
	 * @param mediaText Media text.
	 */
	public set mediaText(mediaText: string) {
		this[PropertySymbol.cssRule][PropertySymbol.conditionText] = mediaText;
	}

	/**
	 * Returns item.
	 *
	 * @param index Index.
	 * @returns Item.
	 */
	public item(index: number): string {
		return (
			this[PropertySymbol.cssRule][PropertySymbol.conditionText].split(MEDIUM_REGEXP)[index] || null
		);
	}

	/**
	 * Appends a medium.
	 *
	 * @param medium Medium.
	 */
	public appendMedium(medium: string): void {
		const media = this[PropertySymbol.cssRule][PropertySymbol.conditionText].trim()
			? this[PropertySymbol.cssRule][PropertySymbol.conditionText].split(MEDIUM_REGEXP)
			: [];
		if (media.indexOf(medium) === -1) {
			media.push(medium);
			this[PropertySymbol.cssRule][PropertySymbol.conditionText] = media.join(', ');
		}
	}

	/**
	 * Deletes a medium.
	 *
	 * @param medium Medium.
	 */
	public deleteMedium(medium: string): void {
		const media = this[PropertySymbol.cssRule][PropertySymbol.conditionText].split(MEDIUM_REGEXP);
		const index = media.indexOf(medium);
		if (index !== -1) {
			media.splice(index, 1);
			this[PropertySymbol.cssRule][PropertySymbol.conditionText] = media.join(', ');
		}
	}
}
