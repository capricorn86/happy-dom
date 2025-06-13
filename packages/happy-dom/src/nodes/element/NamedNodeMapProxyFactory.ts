/* eslint-disable filenames/match-exported */

import ClassMethodBinder from '../../utilities/ClassMethodBinder.js';
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
		const methodBinder = new ClassMethodBinder(this, [NamedNodeMap]);

		return new Proxy<NamedNodeMap>(namedNodeMap, {
			get: (target, property) => {
				if (property === 'length') {
					return namedNodeMap[PropertySymbol.items].size;
				}
				if (property in target || typeof property === 'symbol') {
					methodBinder.bind(property);
					return (<any>target)[property];
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return target.item(index);
				}
				return target.getNamedItem(<string>property) || undefined;
			},
			set(target, property, newValue): boolean {
				methodBinder.bind(property);
				if (typeof property === 'symbol') {
					(<any>target)[property] = newValue;
					return true;
				}
				const index = Number(property);
				if (isNaN(index)) {
					(<any>target)[property] = newValue;
				}
				return true;
			},
			deleteProperty(target, property): boolean {
				if (typeof property === 'symbol') {
					delete (<any>target)[property];
					return true;
				}
				const index = Number(property);
				if (isNaN(index)) {
					delete (<any>target)[property];
				}
				return true;
			},
			ownKeys(): string[] {
				const keys = Array.from(namedNodeMap[PropertySymbol.items].keys());
				for (let i = 0, max = namedNodeMap[PropertySymbol.items].size; i < max; i++) {
					keys.push(String(i));
				}
				return keys;
			},
			has(target, property): boolean {
				if (typeof property === 'symbol') {
					return false;
				}

				if (property in target || namedNodeMap[PropertySymbol.items].has(property)) {
					return true;
				}

				const index = Number(property);

				if (!isNaN(index) && index >= 0 && index < namedNodeMap[PropertySymbol.items].size) {
					return true;
				}

				return false;
			},
			defineProperty(target, property, descriptor): boolean {
				methodBinder.preventBinding(property);

				if (property in target) {
					Object.defineProperty(target, property, descriptor);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor | undefined {
				if (property in target || typeof property === 'symbol') {
					return;
				}

				const index = Number(property);
				if (!isNaN(index)) {
					if (index >= 0) {
						const itemByIndex = target.item(index);
						if (itemByIndex) {
							return {
								value: itemByIndex,
								writable: false,
								enumerable: true,
								configurable: true
							};
						}
					}
					return;
				}

				const items = namedNodeMap[PropertySymbol.items].get(<string>property);

				if (items) {
					return {
						value: items,
						writable: false,
						enumerable: true,
						configurable: true
					};
				}
			}
		});
	}
}
