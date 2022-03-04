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
	// False if setting a cookie will be ignored and true otherwise.
	public readonly cookieEnabled: boolean = true;

	// TODO: Not implemented.
	public readonly credentials: string = null;

	// TODO: Not implemented.
	public readonly geolocation: string = null;

	// String representing the preferred language of the user, usually the language of the browser UI.
	public readonly language: string = 'en-US';

	// Array of string representing the user's preferred languages.
	public readonly languages: string[] = ['en-US', 'en'];

	// TODO: Not implemented.
	public readonly locks: string = null;

	// Maximum number of simultaneous touch contact points are supported by the current device.
	public readonly maxTouchPoints: number = 0;

	// Number of logical processors available to run threads on the user's computer.
	public readonly hardwareConcurrency: number = 8;

	// Browser app code name.
	public readonly appCodeName: string = 'Mozilla';

	// Browser app name.
	public readonly appName: string = 'Netscape';

	// Browser app version.
	public readonly appVersion: string = '5.0 (Windows)';

	// Browser platform.
	public readonly platform: string = 'Win32';

	// Browser product.
	public readonly product: string = 'Gecko';

	// Browser product sub.
	public readonly productSub: string = '20100101';

	// Browser vendor.
	public readonly vendor: string = '';

	// Browser vendor sub.
	public readonly vendorSub: string = '';

	// Browser user agent.
	// "appCodeName/appVersion number (Platform; Security; OS-or-CPU; Localization; rv: revision-version-number) product/productSub Application-Name Application-Name-version".
	public readonly userAgent: string =
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0';

	// Boolean value indicating whether the browser is working online.
	public readonly onLine: boolean = true;

	// TODO: Not implemented.
	public readonly permissions: string = null;

	// Boolean Indicates whether the user agent is controlled by automation.
	public readonly webdriver: boolean = true;

	// The user's Do Not Track setting, which indicates whether the user is requesting web sites and advertisers to not track them.
	// The value of the property reflects that of the DNT HTTP header, i.e. Values of "1", "0", or "unspecified".
	public readonly doNotTrack: string = 'unspecified';

	// Browser mime-types.
	public readonly mimeTypes: MimeTypeArray = new MimeTypeArray([]);

	// Browser plugins.
	public readonly plugins: PluginArray = new PluginArray([]);

	/**
	 * Returns the object as a string.
	 *
	 * @returns String.
	 */
	public toString(): string {
		return '[object Navigator]';
	}
}
