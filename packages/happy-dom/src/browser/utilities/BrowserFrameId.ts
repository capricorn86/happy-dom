/**
 * Browser frame ID generator.
 */
export default class BrowserFrameId {
	public static id = 1;

	/**
	 * Returns a unique frame ID.
	 *
	 * @returns Unique frame ID.
	 */
	public static getUniqueID(): number {
		return this.id++;
	}
}
