/**
 * Node utility.
 */
export default class ClassMethodBinder {
	/**
	 * Binds methods to a target.
	 *
	 * @param target Target.
	 * @param classes Classes.
	 * @param [options] Options.
	 * @param [options.bindSymbols] Bind symbol methods.
	 * @param [options.forwardToPrototype] Forwards the method calls to the prototype. This makes it possible for test tools to override methods on the prototype (e.g. Object.defineProperty(HTMLCollection.prototype, 'item', {})).
	 */
	public static bindMethods(
		target: Object,
		classes: any[],
		options?: { bindSymbols: boolean; forwardToPrototype: boolean }
	): void {
		for (const _class of classes) {
			const propertyDescriptors = Object.getOwnPropertyDescriptors(_class.prototype);
			const keys: Array<string | symbol> = Object.keys(propertyDescriptors);

			if (options?.bindSymbols) {
				for (const symbol of Object.getOwnPropertySymbols(propertyDescriptors)) {
					keys.push(symbol);
				}
			}

			if (options?.forwardToPrototype) {
				for (const key of keys) {
					const descriptor = propertyDescriptors[<string>key];
					if (descriptor.get || descriptor.set) {
						Object.defineProperty(target, key, {
							...descriptor,
							get:
								descriptor.get &&
								(() => Object.getOwnPropertyDescriptor(_class.prototype, key).get.call(target)),
							set:
								descriptor.set &&
								((newValue) =>
									Object.getOwnPropertyDescriptor(_class.prototype, key).set.call(target, newValue))
						});
					} else if (
						key !== 'constructor' &&
						typeof descriptor.value === 'function' &&
						!descriptor.value.toString().startsWith('class ')
					) {
						Object.defineProperty(target, key, {
							...descriptor,
							value: (...args) => _class.prototype[key].apply(target, args)
						});
					}
				}
			} else {
				for (const key of keys) {
					const descriptor = propertyDescriptors[<string>key];
					if (descriptor.get || descriptor.set) {
						Object.defineProperty(target, key, {
							...descriptor,
							get: descriptor.get?.bind(target),
							set: descriptor.set?.bind(target)
						});
					} else if (
						key !== 'constructor' &&
						typeof descriptor.value === 'function' &&
						!descriptor.value.toString().startsWith('class ')
					) {
						Object.defineProperty(target, key, {
							...descriptor,
							value: descriptor.value.bind(target)
						});
					}
				}
			}
		}
	}
}
