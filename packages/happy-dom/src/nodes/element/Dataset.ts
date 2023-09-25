import Element from '../element/Element.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';

/**
 * Storage type for a dataset proxy.
 */
type DatasetRecord = Record<string, string>;

/**
 * Dataset helper proxy.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
 */
export default class Dataset {
	public readonly proxy: DatasetRecord;

	/**
	 * @param element The parent element.
	 */
	constructor(element: Element) {
		// Build the initial dataset record from all data attributes.
		const dataset: DatasetRecord = {};

		for (let i = 0, max = element.attributes.length; i < max; i++) {
			const attribute = element.attributes[i];
			if (attribute.name.startsWith('data-')) {
				const key = Dataset.kebabToCamelCase(attribute.name.replace('data-', ''));
				dataset[key] = attribute.value;
			}
		}

		// Documentation for Proxy:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
		this.proxy = new Proxy(dataset, {
			get(dataset: DatasetRecord, key: string): string {
				const attribute = element.attributes.getNamedItem('data-' + Dataset.camelCaseToKebab(key));
				if (attribute) {
					return (dataset[key] = attribute.value);
				}
				delete dataset[key];
				return undefined;
			},
			set(dataset: DatasetRecord, key: string, value: string): boolean {
				element.setAttribute('data-' + Dataset.camelCaseToKebab(key), value);
				dataset[key] = value;
				return true;
			},
			deleteProperty(dataset: DatasetRecord, key: string): boolean {
				(<HTMLElementNamedNodeMap>element.attributes)._removeNamedItem(
					'data-' + Dataset.camelCaseToKebab(key)
				);
				return delete dataset[key];
			},
			ownKeys(dataset: DatasetRecord): string[] {
				// According to Mozilla we have to update the dataset object (target) to contain the same keys as what we return:
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys
				// "The result List must contain the keys of all non-configurable own properties of the target object."
				const keys = [];
				const deleteKeys = [];
				for (let i = 0, max = element.attributes.length; i < max; i++) {
					const attribute = element.attributes[i];
					if (attribute.name.startsWith('data-')) {
						const key = Dataset.kebabToCamelCase(attribute.name.replace('data-', ''));
						keys.push(key);
						dataset[key] = attribute.value;
						if (!dataset[key]) {
							deleteKeys.push(key);
						}
					}
				}
				for (const key of deleteKeys) {
					delete dataset[key];
				}
				return keys;
			},
			has(_dataset: DatasetRecord, key: string): boolean {
				return !!element.attributes.getNamedItem('data-' + Dataset.camelCaseToKebab(key));
			}
		});
	}

	/**
	 * Transforms a kebab cased string to camel case.
	 *
	 * @param text Text string.
	 * @returns Camel cased string.
	 */
	public static kebabToCamelCase(text: string): string {
		const parts = text.split('-');
		for (let i = 0, max = parts.length; i < max; i++) {
			parts[i] = i > 0 ? parts[i].charAt(0).toUpperCase() + parts[i].slice(1) : parts[i];
		}
		return parts.join('');
	}

	/**
	 * Transforms a camel cased string to kebab case.
	 *
	 * @param text Text string.
	 * @returns Kebab cased string.
	 */
	public static camelCaseToKebab(text: string): string {
		return text
			.toString()
			.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
	}
}
