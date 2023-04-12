import MimeTypeArray from './MimeTypeArray';
import PluginArray from './PluginArray';

/**
 * Browser Navigator API.
 *
 * Mocked information is taken from FireFox.
 *
 * Reference:
 * https://html.spec.whatwg.org/multipage/system-state.html#dom-navigator.
 */
export default class Navigator {
	/**
	 * False if setting a cookie will be ignored and true otherwise.
	 */
	public get cookieEnabled(): boolean {
		return true;
	}

	/**
	 * TODO: Not implemented.
	 */
	public get credentials(): string {
		return null;
	}

	/**
	 * TODO: Not implemented.
	 */
	public get geolocation(): string {
		return null;
	}

	/**
	 * String representing the preferred language of the user, usually the language of the browser UI.
	 */
	public get language(): string {
		return 'en-US';
	}

	/**
	 * Array of string representing the user's preferred languages.
	 */
	public get languages(): string[] {
		return ['en-US', 'en'];
	}

	/**
	 * TODO: Not implemented.
	 */
	public get locks(): string {
		return null;
	}

	/**
	 * Maximum number of simultaneous touch contact points are supported by the current device.
	 */
	public get maxTouchPoints(): number {
		return 0;
	}

	/**
	 * Number of logical processors available to run threads on the user's computer.
	 */
	public get hardwareConcurrency(): number {
		return 8;
	}

	/**
	 * Browser app code name.
	 */
	public get appCodeName(): string {
		return 'Mozilla';
	}

	/**
	 * Browser app name.
	 */
	public get appName(): string {
		return 'Netscape';
	}

	/**
	 * Browser app version.
	 */
	public get appVersion(): string {
		return '5.0 (Windows)';
	}

	/**
	 * Browser platform.
	 */
	public get platform(): string {
		return 'Win32';
	}

	/**
	 * Browser product.
	 */
	public get product(): string {
		return 'Gecko';
	}

	/**
	 * Browser product sub.
	 */
	public get productSub(): string {
		return '20100101';
	}

	/**
	 * Browser vendor.
	 */
	public get vendor(): string {
		return '';
	}

	/**
	 * Browser vendor sub.
	 */
	public get vendorSub(): string {
		return '';
	}

	/**
	 * Browser user agent.
	 *
	 * "appCodeName/appVersion number (Platform; Security; OS-or-CPU; Localization; rv: revision-version-number) product/productSub Application-Name Application-Name-version".
	 */
	public get userAgent(): string {
		return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0';
	}

	/**
	 * Boolean value indicating whether the browser is working online.
	 */
	public get onLine(): boolean {
		return true;
	}

	/**
	 * TODO: Not implemented.
	 */
	public get permissions(): string {
		return null;
	}

	/**
	 * Boolean Indicates whether the user agent is controlled by automation.
	 */
	public get webdriver(): boolean {
		return true;
	}

	/**
	 * The user's Do Not Track setting, which indicates whether the user is requesting web sites and advertisers to not track them.
	 *
	 * The value of the property reflects that of the DNT HTTP header, i.e. Values of "1", "0", or "unspecified".
	 */
	public get doNotTrack(): string {
		return 'unspecified';
	}

	/**
	 * Browser mime-types.
	 */
	public get mimeTypes(): MimeTypeArray {
		return new MimeTypeArray([]);
	}

	/**
	 * Browser plugins.
	 */
	public get plugins(): PluginArray {
		return new PluginArray([]);
	}

	/**
	 * Returns the object as a string.
	 *
	 * @returns String.
	 */
	public toString(): string {
		return '[object Navigator]';
	}
}
