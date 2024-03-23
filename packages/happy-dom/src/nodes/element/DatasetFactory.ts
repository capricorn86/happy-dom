import Element from './Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElementNamedNodeMap from '../html-element/HTMLElementNamedNodeMap.js';
import DatasetUtility from './DatasetUtility.js';
import IDataset from './IDataset.js';

/**
 * Dataset factory.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
 */
export default class DatasetFactory {
	/**
	 * @param element The parent element.
	 */
	public static createDataset(element: Element): IDataset {
		// Build the initial dataset record from all data attributes.
		const dataset: IDataset = {};

		for (let i = 0, max = element[PropertySymbol.attributes].length; i < max; i++) {
			const attribute = element[PropertySymbol.attributes][i];
			if (attribute[PropertySymbol.name].startsWith('data-')) {
				const key = DatasetUtility.kebabToCamelCase(
					attribute[PropertySymbol.name].replace('data-', '')
				);
				dataset[key] = attribute[PropertySymbol.value];
			}
		}

		// Documentation for Proxy:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
		return new Proxy(dataset, {
			get(dataset: IDataset, key: string): string {
				const attribute = element[PropertySymbol.attributes].getNamedItem(
					'data-' + DatasetUtility.camelCaseToKebab(key)
				);
				if (attribute) {
					return (dataset[key] = attribute[PropertySymbol.value]);
				}
				delete dataset[key];
				return undefined;
			},
			set(dataset: IDataset, key: string, value: string): boolean {
				element.setAttribute('data-' + DatasetUtility.camelCaseToKebab(key), value);
				dataset[key] = value;
				return true;
			},
			deleteProperty(dataset: IDataset, key: string): boolean {
				(<HTMLElementNamedNodeMap>element[PropertySymbol.attributes])[
					PropertySymbol.removeNamedItem
				]('data-' + DatasetUtility.camelCaseToKebab(key));
				return delete dataset[key];
			},
			ownKeys(dataset: IDataset): string[] {
				// According to Mozilla we have to update the dataset object (target) to contain the same keys as what we return:
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys
				// "The result List must contain the keys of all non-configurable own properties of the target object."
				const keys = [];
				const deleteKeys = [];
				for (let i = 0, max = element[PropertySymbol.attributes].length; i < max; i++) {
					const attribute = element[PropertySymbol.attributes][i];
					if (attribute[PropertySymbol.name].startsWith('data-')) {
						const key = DatasetUtility.kebabToCamelCase(
							attribute[PropertySymbol.name].replace('data-', '')
						);
						keys.push(key);
						dataset[key] = attribute[PropertySymbol.value];
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
			has(_dataset: IDataset, key: string): boolean {
				return !!element[PropertySymbol.attributes].getNamedItem(
					'data-' + DatasetUtility.camelCaseToKebab(key)
				);
			}
		});
	}
}
