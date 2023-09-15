import FS from 'fs';
import Path from 'path';

/**
 * Utility for navigator.
 */
export default class NavigatorUtility {
	/**
	 * Returns the package version.
	 *
	 * @returns Package version.
	 */
	public static getHappyDOMVersion(): string {
		const content = FS.readFileSync(Path.resolve('package.json')).toString();
		const json = JSON.parse(content);
		return json.version;
	}

	/**
	 * Returns platform.
	 *
	 * @returns Platform.
	 */
	public static getPlatform(): string {
		const platform = process.platform;
		const platformCapitalized = platform.charAt(0).toUpperCase() + platform.slice(1);
		return 'X11; ' + platformCapitalized + ' ' + process.arch;
	}
}
