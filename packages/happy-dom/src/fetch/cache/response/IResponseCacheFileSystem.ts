/**
 * Fetch response cache file system implementation.
 */
export default interface IResponseCacheFileSystem {
	/**
	 * Loads the cache from file system.
	 *
	 * @param directory Directory to load from.
	 */
	load(directory: string): Promise<void>;

	/**
	 * Saves the cache to file system.
	 *
	 * @param directory Directory to store to.
	 */
	save(directory: string): Promise<void>;
}
