const ABC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * CSS Cache.
 */
export default class ShadowRootCSSCache {
	private original: string[] = [];
	private scoped: string[] = [];

	/**
	 * Returns the scoped CSS.
	 *
	 * @return Scoped style.
	 */
	public getAllScoped(): string[] {
		return this.scoped.concat();
	}

	/**
	 * Returns scoped CSS.
	 *
	 * @param original Original CSS.
	 * @return Cached scoped CSS.
	 */
	public getScoped(original: string): string {
		const index = this.original.indexOf(original);
		if (index !== -1) {
			return this.scoped[index];
		}
		return null;
	}

	/**
	 * Returns scoped CSS.
	 *
	 * @param original Original CSS.
	 * @param scopedCSS Scoped CSS.
	 */
	public setScoped(original: string, scopedCSS: string): void {
		const index = this.original.indexOf(original);
		if (index !== -1) {
			this.original[index] = original;
			this.scoped[index] = scopedCSS;
		} else {
			this.original.push(original);
			this.scoped.push(scopedCSS);
		}
	}

	/**
	 * Removes a cache entry.
	 *
	 * @param original Original CSS.
	 */
	public removeScoped(original: string): void {
		const index = this.original.indexOf(original);
		if (index !== -1) {
			this.original.splice(index, 1);
			this.scoped.splice(index, 1);
		}
	}

	/**
	 * Returns scope ID.
	 *
	 * @param original Original CSS.
	 * @return string Scope ID.
	 */
	public getScopeID(original: string): string {
		const index = this.original.indexOf(original);
		if (index !== -1) {
			return this.getIdByIndex(index);
		}
		return this.getIdByIndex(this.original.length);
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
	 * @param index Index.
	 * @return ID.
	 */
	private getIdByIndex(index: number): string {
		return ABC[index] !== undefined ? ABC[index] : 'a' + index;
	}
}
