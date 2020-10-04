export default class Attribute {
	public value: string = null;
	public name: string = null;
	public namespaceURI: string = null;

	/**
	 * Returns local name.
	 *
	 * @returns Local name.
	 */
	public get localName(): string {
		return this.name ? this.name.split(':').reverse()[0] : null;
	}

	/**
	 * Returns prefix.
	 *
	 * @returns Prefix.
	 */
	public get prefix(): string {
		return this.name ? this.name.split(':')[0] : null;
	}
}
