/**
 * DOM Matrix.
 *
 * TODO: Not fully implemented.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
 */
export default class DOMMatrix {
	/**
	 * Returns 2D state.
	 *
	 * @returns 2D state.
	 */
	public get is2D(): boolean {
		return false;
	}

	/**
	 * Returns identity state.
	 *
	 * @returns Identity state.
	 */
	public get isIdentity(): boolean {
		return false;
	}
}
