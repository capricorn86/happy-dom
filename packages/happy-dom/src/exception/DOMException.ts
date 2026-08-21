import DOMExceptionNameEnum from './DOMExceptionNameEnum.js';
import DOMExceptionLegacyCode from './DOMExceptionLegacyCode.js';

/**
 * DOM Exception.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMException/DOMException.
 */
export default class DOMException extends Error {
	/**
	 * Constructor.
	 *
	 * @param message Message.
	 * @param name Name.
	 */
	constructor(message: string, name: string | null = null) {
		super(message);

		this.name = name || DOMExceptionNameEnum.domException;
	}

	/**
	 * Returns the legacy code for the exception's name, or 0 when the name has no entry in the DOMException names table.
	 *
	 * Reference:
	 * https://webidl.spec.whatwg.org/#dom-domexception-code.
	 *
	 * @returns Legacy code.
	 */
	public get code(): number {
		return DOMExceptionLegacyCode[this.name] ?? 0;
	}
}
