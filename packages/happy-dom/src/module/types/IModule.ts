/**
 * Module interface.
 */
export default interface IModule {
	url: URL;

	/**
	 * Compiles and evaluates the module.
	 *
	 * @returns Module exports.
	 */
	evaluate(): Promise<{ [key: string]: any }>;

	/**
	 * Compiles and preloads the module and its imports.
	 *
	 * @returns Promise.
	 */
	preload(): Promise<void>;
}
