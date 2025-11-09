/**
 * Package version.
 */
export default class PackageVersion {
	/**
	 * Prints help information.
	 */
	public static async getVersion(): Promise<string> {
		const packageJson = await import('../../package.json', { with: { type: 'json' } });
		return packageJson.default['version'];
	}
}
