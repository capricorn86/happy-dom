/**
 * Node utility.
 */
export default class ClassMethodBinder {
	private target: Object;
	private classes: any[];
	private cache = new Map<string | symbol, Boolean>();

	/**
	 * Constructor.
	 *
	 * @param target Target.
	 * @param classes Classes.
	 */
	constructor(target: Object, classes: any[]) {
		this.target = target;
		this.classes = classes;
	}

	/**
	 * Binds method, getters and setters to a target.
	 *
	 * @param name Method name.
	 */
	public bind(name: string | symbol): void {
		// We should never bind the Symbol.iterator method as it can cause problems with Array.from()
		if (this.cache.has(name) || name === Symbol.iterator) {
			return;
		}

		this.cache.set(name, true);

		const target = this.target;

		if (!(name in target)) {
			return;
		}

		for (const _class of this.classes) {
			const descriptor = Object.getOwnPropertyDescriptor(_class.prototype, name);
			if (descriptor) {
				if (typeof descriptor.value === 'function') {
					Object.defineProperty(target, name, {
						...descriptor,
						value: descriptor.value.bind(target)
					});
				} else if (descriptor.get !== undefined) {
					Object.defineProperty(target, name, {
						...descriptor,
						get: descriptor.get?.bind(target),
						set: descriptor.set?.bind(target)
					});
				}
				return;
			}
		}
	}

	/**
	 * Prevents a method, getter or setter from being bound.
	 *
	 * @param name Method name.
	 */
	public preventBinding(name: string | symbol): void {
		this.cache.set(name, true);
	}
}
