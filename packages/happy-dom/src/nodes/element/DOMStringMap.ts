import Element from './Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import DOMStringMapUtility from './DOMStringMapUtility.js';

/**
 * Dataset factory.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
 */
export default class DOMStringMap {
	[key: string]: string;

	/**
	 * Constructor.
	 *
	 * @param element Element.
	 */
	constructor(element: Element) {
		// Documentation for Proxy:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
		return new Proxy(this, {
			get(_target, property: string): string {
				const attribute = element[PropertySymbol.attributes].getNamedItem(
					'data-' + DOMStringMapUtility.camelCaseToKebab(property)
				);
				if (attribute) {
					return attribute[PropertySymbol.value];
				}
			},
			set(_target, property: string, value: string): boolean {
				element.setAttribute('data-' + DOMStringMapUtility.camelCaseToKebab(property), value);
				return true;
			},
			deleteProperty(_target, property: string): boolean {
				const attributes = element[PropertySymbol.attributes];
				const dataKey = 'data-' + DOMStringMapUtility.camelCaseToKebab(property);
				const item = attributes.getNamedItem(dataKey);
				if (!item) {
					return true;
				}
				attributes[PropertySymbol.removeNamedItem](item);
				return true;
			},
			ownKeys(_target): string[] {
				// According to Mozilla we have to update the dataset object (target) to contain the same keys as what we return:
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys
				// "The result List must contain the keys of all non-configurable own properties of the target object."
				const keys = [];
				const attributes = element[PropertySymbol.attributes];
				for (let i = 0, max = attributes.length; i < max; i++) {
					const name = attributes[i][PropertySymbol.name];
					if (name.startsWith('data-')) {
						keys.push(DOMStringMapUtility.kebabToCamelCase(name.replace('data-', '')));
					}
				}
				return keys;
			},
			has(_target, property: string): boolean {
				return !!element[PropertySymbol.attributes].getNamedItem(
					'data-' + DOMStringMapUtility.camelCaseToKebab(property)
				);
			},
			defineProperty(_target, property: string, descriptor): boolean {
				if (descriptor.value === undefined) {
					return false;
				}

				element.setAttribute(
					'data-' + DOMStringMapUtility.camelCaseToKebab(property),
					descriptor.value
				);

				return true;
			},
			getOwnPropertyDescriptor(_target, property: string): PropertyDescriptor {
				const attribute = element[PropertySymbol.attributes].getNamedItem(
					'data-' + DOMStringMapUtility.camelCaseToKebab(property)
				);
				if (attribute) {
					return {
						value: attribute[PropertySymbol.value],
						writable: true,
						enumerable: true,
						configurable: true
					};
				}
			}
		});
	}
}
