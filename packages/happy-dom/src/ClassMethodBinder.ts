/**
 * Node utility.
 */
export default class ClassMethodBinder {
	/**
	 * Binds methods to a target.
	 *
	 * @param target Target.
	 * @param classes Classes.
	 * @param bindSymbols
	 */
	public static bindMethods(target: Object, classes: any[], bindSymbols = false): void {
		for (const _class of classes) {
			const propertyDescriptors = Object.getOwnPropertyDescriptors(_class.prototype);
			const keys: Array<string | symbol> = Object.keys(propertyDescriptors);

			if (bindSymbols) {
				for (const symbol of Object.getOwnPropertySymbols(propertyDescriptors)) {
					keys.push(symbol);
				}
			}

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
						// In order for test tools to be able to override properties on the class prototype, we need to use the value from the class prototype instead of binding it directly to the target.
						value: (...args) => _class.prototype[key].apply(target, args)
					});
				}
			}
		}
	}
}
