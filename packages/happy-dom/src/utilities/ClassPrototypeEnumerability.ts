/**
 * Utilities for making interface members declared on a class prototype enumerable.
 *
 * In browsers, IDL members are enumerable on the prototype (e.g.
 * `MutationObserver.prototype.propertyIsEnumerable('observe')` returns `true`), while methods and
 * accessors declared with ES class syntax are non-enumerable. Libraries such as zone.js enumerate
 * prototype members to forward calls through proxies, and break when the members are not
 * enumerable.
 *
 * Note that "Object.prototype.propertyIsEnumerable()" only considers properties owned by the
 * prototype itself and does not traverse the prototype chain. Classes created by extending another
 * class therefore need their members defined on their own prototype, which is what the "source"
 * argument of "makeEnumerable()" is for.
 */
export default class ClassPrototypeEnumerability {
	/**
	 * Makes methods and accessors enumerable on a prototype.
	 *
	 * When a source class is provided, the members are read from the prototype of the source class
	 * and defined on the prototype of the target class. This is needed for classes extending another
	 * class, as "Object.prototype.propertyIsEnumerable()" does not traverse the prototype chain.
	 *
	 * @param target Class to make members enumerable on.
	 * @param source Class to read members from. Defaults to the target class.
	 */
	public static makeEnumerable(target: any, source?: any): void {
		const targetPrototype = target?.prototype;
		const sourcePrototype = source?.prototype ?? target?.prototype;

		if (!targetPrototype || !sourcePrototype) {
			return;
		}

		for (const name of Object.getOwnPropertyNames(sourcePrototype)) {
			if (name === 'constructor') {
				continue;
			}

			const descriptor = Object.getOwnPropertyDescriptor(sourcePrototype, name);

			if (!descriptor || !descriptor.configurable) {
				continue;
			}

			if (typeof descriptor.value === 'function' || descriptor.get || descriptor.set) {
				Object.defineProperty(targetPrototype, name, { ...descriptor, enumerable: true });
			}
		}
	}
}
