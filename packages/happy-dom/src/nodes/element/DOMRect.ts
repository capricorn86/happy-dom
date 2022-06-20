/**
 * Bounding rect object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
 */
export default class DOMRect {
	public x = 0;
	public y = 0;
	public width = 0;
	public height = 0;
	public top = 0;
	public right = 0;
	public bottom = 0;
	public left = 0;

	/**
	 * Constructor.
	 *
	 * @param [x] X position.
	 * @param [y] Y position.
	 * @param [width] Width.
	 * @param [height] Height.
	 */
	constructor(x?, y?, width?, height?) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 0;
		this.height = height || 0;
	}
}
