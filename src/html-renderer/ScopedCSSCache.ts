const ABC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * CSS Cache.
 */
export default class ScopedCSSCache {
	private original: string[] = [];
	private scoped: string[] = [];

	/**
	 * Returns the scoped CSS.
	 *
	 * @return {string[]} Scoped style.
	 */
	public getAllScopedCSS(): string[] {
		return this.scoped.concat();
	}

	/**
	 * Returns the original extracted CSS.
	 *
	 * @return {string[]} Scoped style.
	 */
	public getAllExtractedCSS(): string[] {
		return this.original.concat();
	}

	/**
	 * Returns scoped CSS.
	 *
	 * @param {string} css CSS.
	 * @return {string} Cached scoped CSS.
	 */
	public getScopedCSS(css: string): string {
		const index = this.original.indexOf(css);
		if (index !== -1) {
			return this.scoped[index];
		}
		return null;
	}

	/**
	 * Returns scope ID.
	 *
	 * @param {string} css CSS.
	 * @return string Scope ID.
	 */
	public getScopeID(css: string): string {
		const index = this.original.indexOf(css);
		if (index !== -1) {
			return this.getIdByIndex(index);
		}
		return this.getIdByIndex(this.original.length);
	}

	/**
	 * Returns scoped CSS.
	 *
	 * @param {string} css CSS.
	 * @param {string} scopedCSS Scoped CSS.
	 */
	public setScopedCSS(css: string, scopedCSS): void {
		const index = this.original.indexOf(css);
		if (index !== -1) {
			this.original[index] = css;
			this.scoped[index] = scopedCSS;
		} else {
			this.original.push(css);
			this.scoped.push(scopedCSS);
		}
	}

	/**
	 * Removes a cache entry.
	 *
	 * @param {string} css CSS.
	 */
	public removeScopedCSS(css: string): void {
		const index = this.original.indexOf(css);
		if (index !== -1) {
			this.original.splice(index, 1);
			this.scoped.splice(index, 1);
		}
	}

	/**
	 * Clears cache.
	 */
	public clear(): void {
		this.original = [];
		this.scoped = [];
	}

	/**
	 * Returns an unique ID.
	 *
	 * @param {number} index Index.
	 * @return {string} ID.
	 */
	private getIdByIndex(index: number): string {
		return ABC[index] !== undefined ? ABC[index] : 'a' + index;
	}
}
