import GlobalWindow from './GlobalWindow';
import VM from 'vm';
import GlobalProperties from './GlobalProperties';

/**
 * Browser window without a VM in the global scope.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class Window extends GlobalWindow {
	/**
	 * Constructor.
	 */
	constructor() {
		super();

		for (const property of GlobalProperties) {
			delete this[property];
		}

		if (!VM.isContext(this)) {
			VM.createContext(this);
		}
	}

	/**
	 * Evaluates code.
	 *
	 * @override
	 * @param code Code.
	 * @returns Result.
	 */
	public eval(code: string): unknown {
		return VM.runInContext(code, this);
	}
}
