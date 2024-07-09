/* eslint-disable filenames/match-exported */

import * as PropertySymbol from '../../PropertySymbol.js';
import NamedNodeMap from './NamedNodeMap.js';

/**
 * Named Node Map.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
 */
export default class NamedNodeMapProxyFactory {
	/**
	 * Constructor.
	 *
	 * @param namedNodeMap
	 */
	public static createProxy(namedNodeMap: NamedNodeMap): NamedNodeMap {
		return new Proxy<NamedNodeMap>(namedNodeMap, {
			get(attributes: NamedNodeMap, key: string): unknown {
				const returnValue = attributes[key];
				if (typeof returnValue === 'function') {
					return returnValue.bind(attributes);
				}
				if (returnValue !== undefined) {
					return returnValue;
				}
				return attributes.getNamedItem(key) ?? undefined;
			},
			set(): boolean {
				return true;
			},
			deleteProperty(): boolean {
				return true;
			},
			ownKeys(attributes: NamedNodeMap): string[] {
				const keys = Array.from(attributes[PropertySymbol.namedItems].keys());
				for (let i = 0, max = attributes.length; i < max; i++) {
					keys.push(String(i));
				}
				return keys;
			},
			has(attributes: NamedNodeMap, key: string): boolean {
				if (attributes[PropertySymbol.namedItems].has(key)) {
					return true;
				}
				const index = parseInt(key, 10);
				return !isNaN(index) && index < attributes.length;
			},
			defineProperty(
				attributes: NamedNodeMap,
				key: string,
				descriptor: PropertyDescriptor
			): boolean {
				if (!NamedNodeMap.prototype.hasOwnProperty(key)) {
					return false;
				}
				if (descriptor.get || descriptor.set) {
					Object.defineProperty(attributes, key, {
						...descriptor,
						get: descriptor.get ? descriptor.get.bind(attributes) : undefined,
						set: descriptor.set ? descriptor.set.bind(attributes) : undefined
					});
				} else {
					Object.defineProperty(attributes, key, {
						...descriptor,
						value:
							typeof descriptor.value === 'function'
								? descriptor.value.bind(attributes)
								: descriptor.value
					});
				}
				return true;
			},
			getOwnPropertyDescriptor(attributes: NamedNodeMap, key: string): PropertyDescriptor {
				if (NamedNodeMap.prototype.hasOwnProperty(key)) {
					return;
				}

				if (attributes[PropertySymbol.namedItems].has(key)) {
					return {
						value: attributes[PropertySymbol.namedItems].get(key),
						writable: false,
						enumerable: false,
						configurable: false
					};
				}

				const index = parseInt(key, 10);
				if (!isNaN(index) && index < attributes.length) {
					return {
						value: attributes[index],
						writable: false,
						enumerable: false,
						configurable: false
					};
				}
			}
		});
	}
}
