import Window from './Window';

/**
 * Browser window without a VM running in the global scope.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class GlobalWindow extends Window {
	/**
	 * Evaluates code.
	 *
	 * @param code Code.
	 * @returns Result.
	 */
	public eval(code: string): unknown {
		return eval(code);
	}

	/**
	 * Setup of globals.
	 */
	protected _setupVMContext(): void {
		this._setupGlobals();
	}
}
