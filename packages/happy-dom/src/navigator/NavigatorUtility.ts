import FS from 'fs';
import Path from 'path';
import { fileURLToPath, URL } from 'url';

const __dirname = globalThis.__dirname ?? fileURLToPath(new URL('.', import.meta.url));

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
		const content = FS.readFileSync(Path.join(__dirname, '..', '..', 'package.json')).toString();
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
