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
	 * @param [options.proxy] Bind methods using a proxy.
	 */
	public static bindMethods(
		target: Object,
		classes: any[],
		options?: { bindSymbols?: boolean; forwardToPrototype?: boolean; proxy?: any }
	): void {
		for (const _class of classes) {
			const propertyDescriptors = Object.getOwnPropertyDescriptors(_class.prototype);
			const keys: Array<string | symbol> = Object.keys(propertyDescriptors);

			if (options?.bindSymbols) {
				for (const symbol of Object.getOwnPropertySymbols(propertyDescriptors)) {
					keys.push(symbol);
				}
			}

			const scope = options?.proxy ? options.proxy : target;

			if (options?.forwardToPrototype) {
				for (const key of keys) {
					const descriptor = propertyDescriptors[<string>key];
					if (descriptor.get || descriptor.set) {
						Object.defineProperty(target, key, {
							...descriptor,
							get:
								descriptor.get &&
								(() => Object.getOwnPropertyDescriptor(_class.prototype, key).get.call(scope)),
							set:
								descriptor.set &&
								((newValue) =>
									Object.getOwnPropertyDescriptor(_class.prototype, key).set.call(scope, newValue))
						});
					} else if (
						key !== 'constructor' &&
						typeof descriptor.value === 'function' &&
						!descriptor.value.toString().startsWith('class ')
					) {
						Object.defineProperty(target, key, {
							...descriptor,
							value: (...args) => _class.prototype[key].apply(scope, args)
						});
					}
				}
			} else {
				for (const key of keys) {
					const descriptor = propertyDescriptors[<string>key];
					if (descriptor.get || descriptor.set) {
						Object.defineProperty(target, key, {
							...descriptor,
							get: descriptor.get?.bind(scope),
							set: descriptor.set?.bind(scope)
						});
					} else if (
						key !== 'constructor' &&
						typeof descriptor.value === 'function' &&
						!descriptor.value.toString().startsWith('class ')
					) {
						Object.defineProperty(target, key, {
							...descriptor,
							value: descriptor.value.bind(scope)
						});
					}
				}
			}
		}
	}
}
