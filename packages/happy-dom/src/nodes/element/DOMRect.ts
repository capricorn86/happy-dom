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
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.top = this.y;
		this.right = this.x + this.width;
		this.bottom = this.y + this.height;
		this.left = this.x;
	}
	/**
	 * The fromRect() static method of the DOMRect object creates a new DOMRect object with a given location and dimensions.
	 * @param rectangle
	 * @param rectangle.x
	 * @param rectangle.y
	 * @param rectangle.width
	 * @param rectangle.height
	 */
	public static fromRect(
		rectangle: {
			x?: number;
			y?: number;
			width?: number;
			height?: number;
		} = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}
	): DOMRect {
		return new DOMRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	}
}
