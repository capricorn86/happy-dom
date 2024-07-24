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
		const namedItems = namedNodeMap[PropertySymbol.namedItems];
		const namespaceItems = namedNodeMap[PropertySymbol.namespaceItems];

		this.bindMethods(namedNodeMap);

		return new Proxy<NamedNodeMap>(namedNodeMap, {
			get: (target, property) => {
				if (property === 'length') {
					return namespaceItems.size;
				}
				if (property in target || typeof property === 'symbol') {
					return target[property];
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return Array.from(namespaceItems.values())[index];
				}
				return target.getNamedItem(<string>property) || undefined;
			},
			set(): boolean {
				return true;
			},
			deleteProperty(): boolean {
				return true;
			},
			ownKeys(): string[] {
				const keys = Array.from(namedItems.keys());
				for (let i = 0, max = namespaceItems.size; i < max; i++) {
					keys.push(String(i));
				}
				return keys;
			},
			has(target, property): boolean {
				if (typeof property === 'symbol') {
					return false;
				}

				if (property in target || namedItems.has(property)) {
					return true;
				}

				const index = Number(property);

				if (!isNaN(index) && index >= 0 && index < namespaceItems.size) {
					return true;
				}

				return false;
			},
			defineProperty(target, property, descriptor): boolean {
				if (property in target) {
					Reflect.defineProperty(target, property, descriptor);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor {
				if (property in target || typeof property === 'symbol') {
					return;
				}

				const index = Number(property);

				if (!isNaN(index) && index >= 0 && index < namespaceItems.size) {
					return {
						value: Array.from(namespaceItems.values())[index],
						writable: false,
						enumerable: true,
						configurable: false
					};
				}

				const namedItem = target.getNamedItem(<string>property);

				if (namedItem) {
					return {
						value: namedItem,
						writable: false,
						enumerable: true,
						configurable: false
					};
				}
			}
		});
	}

	/**
	 * Bind methods.
	 *
	 * @param target Target.
	 */
	private static bindMethods(target: NamedNodeMap): void {
		const propertyDescriptors = Object.getOwnPropertyDescriptors(target.constructor.prototype);
		for (const key of Object.keys(propertyDescriptors)) {
			const descriptor = propertyDescriptors[key];
			if (descriptor.get || descriptor.set) {
				Object.defineProperty(target, key, {
					configurable: true,
					enumerable: true,
					get: descriptor.get?.bind(target),
					set: descriptor.set?.bind(target)
				});
			} else if (
				key !== 'constructor' &&
				key[0] !== '_' &&
				key[0] === key[0].toLowerCase() &&
				typeof target[key] === 'function' &&
				!target[key].toString().startsWith('class ')
			) {
				target[key] = target[key].bind(target);
			}
		}

		target[Symbol.iterator] = target[Symbol.iterator].bind(target);
	}
}
