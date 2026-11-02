/* eslint-disable filenames/match-exported */

import ClassMethodBinder from '../../utilities/ClassMethodBinder.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import NamedNodeMap from './NamedNodeMap.js';
import NamespaceURI from '../../config/NamespaceURI.js';

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
					return target.item(index) || undefined;
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
			ownKeys: (): string[] => {
				const keys: string[] = [];
				for (let i = 0, max = namedNodeMap[PropertySymbol.items].size; i < max; i++) {
					keys.push(String(i));
				}
				for (const name of this.getSupportedPropertyNames(namedNodeMap)) {
					keys.push(name);
				}
				return keys;
			},
			has: (target, property): boolean => {
				if (typeof property === 'symbol') {
					return false;
				}

				if (property in target || this.getSupportedPropertyNames(namedNodeMap).includes(property)) {
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
			getOwnPropertyDescriptor: (target, property): PropertyDescriptor | undefined => {
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

				if (!this.getSupportedPropertyNames(namedNodeMap).includes(property)) {
					return;
				}

				const item = target.getNamedItem(property);

				if (item) {
					// Named properties are not enumerable, as NamedNodeMap has [LegacyUnenumerableNamedProperties].
					return {
						value: item,
						writable: false,
						enumerable: false,
						configurable: true
					};
				}
			}
		});
	}

	/**
	 * Returns the supported property names (the qualified names of the attributes).
	 *
	 * Duplicates are excluded. Names containing ASCII upper alpha are excluded for elements in the HTML namespace in an HTML document, as they can't be retrieved with getNamedItem().
	 *
	 * @see https://dom.spec.whatwg.org/#ref-for-dfn-supported-property-names
	 * @param namedNodeMap Named node map.
	 * @returns Supported property names.
	 */
	private static getSupportedPropertyNames(namedNodeMap: NamedNodeMap): string[] {
		const ownerElement = namedNodeMap[PropertySymbol.ownerElement];
		const excludeUpperCase =
			ownerElement[PropertySymbol.namespaceURI] === NamespaceURI.html &&
			ownerElement[PropertySymbol.ownerDocument][PropertySymbol.contentType] === 'text/html';
		const names: Set<string> = new Set();

		for (const item of namedNodeMap[PropertySymbol.items].values()) {
			const name = item[PropertySymbol.name]!;
			if (!excludeUpperCase || !/[A-Z]/.test(name)) {
				names.add(name);
			}
		}

		return Array.from(names);
	}
}
