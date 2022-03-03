import MimeTypeArray from './MimeTypeArray';
import PluginArray from './PluginArray';

/**
 * Navigator API.
 * Based on FireFox.
 *
 * Reference:
 * https://html.spec.whatwg.org/multipage/system-state.html#dom-navigator.
 */
export default class Navigator {
	/**
	 * Constructor.
	 **/
	constructor() {}
	/**
	 * Readonly cookieEnabled.
	 *
	 * @returns CookieEnabled: False if setting a cookie will be ignored and true otherwise.
	 */
	public get cookieEnabled(): boolean {
		return true;
	}
	/**
	 * Readonly credentials.
	 *
	 * TODO: NOT IMPL.
	 */
	public get credentials(): null {
		return null;
	}
	/**
	 * Readonly geolocation.
	 *
	 * TODO: NOT IMPL.
	 **/
	public get geolocation(): null {
		return null;
	}
	/**
	 * Readonly language.
	 *
	 * @returns Language: String representing the preferred language of the user, usually the language of the browser UI.
	 **/
	public get language(): string {
		return 'en-US';
	}
	/**
	 * Readonly language.
	 *
	 * @returns Languages: Array of string representing the user's preferred languages.
	 **/
	public get languages(): string[] {
		return ['en-US'];
	}
	/**
	 * Readonly Locks.
	 *
	 * TODO: NOT IMPL.
	 * */
	public get locks(): null {
		return null;
	}
	/**
	 * Readonly maxTouchPoints.
	 *
	 * @returns MaxTouchPoints: the maximum number of simultaneous touch contact points are supported by the current device.
	 * */
	public get maxTouchPoints(): number {
		return 0;
	}
	/**
	 * Readonly hardwareConcurrency.
	 *
	 * @returns HardwareConcurrency: Number of logical processors available to run threads on the user's computer.
	 **/
	public get hardwareConcurrency(): number {
		return 8;
	}
	/**
	 * Readonly appCodeName.
	 *
	 * @returns AppCodeName: 'Mozilla'.
	 */
	public get appCodeName(): string {
		return 'Mozilla';
	}
	/**
	 * Readonly appName.
	 *
	 * @returns AppName: 'Netscape'.
	 * */
	public get appName(): string {
		return 'Netscape';
	}
	/**
	 * Readonly appVersion.
	 *
	 * @returns AppVersion: happy-dom self defined.
	 **/
	public get appVersion(): string {
		return '5.0 (Windows)';
	}

	/**
	 * Readonly platform.
	 * "MacIntel", "Win32", "FreeBSD i386", "WebTV OS".
	 *
	 * @returns Platform: "Win32".
	 */
	public get platform(): string {
		return 'Win32';
	}
	/**
	 * Readonly product.
	 *
	 * @returns Product: "Gecko".
	 */
	public get product(): string {
		return 'Gecko';
	}
	/**
	 * Readonly productSub.
	 *
	 * @returns ProductSub: "20100101".
	 */
	public get productSub(): string {
		return '20100101';
	}
	/**
	 * Readonly vendor.
	 *
	 * @returns Vendor: "".
	 */
	public get vendor(): string {
		return '';
	}
	/**
	 * Readonly vendorSub.
	 *
	 * @returns VendorSub: "".
	 */
	public get vendorSub(): string {
		return '';
	}
	/**
	 * Readonly userAgent.
	 * "appCodeName/appVersion number (Platform; Security; OS-or-CPU; Localization; rv: revision-version-number) product/productSub Application-Name Application-Name-version".
	 *
	 * @returns UserAgent: happy-dom self defined.
	 */
	public get userAgent(): string {
		return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0';
	}
	/**
	 * Readonly onLine.
	 *
	 * @returns Boolean value indicating whether the browser is working online.
	 **/
	public get onLine(): boolean {
		return true;
	}
	/**
	 * Readonly permissions.
	 *
	 * TODO: NOT IMPL.
	 **/
	public get permissions(): null {
		return null;
	}
	/**
	 * Readonly webdriver.
	 *
	 * @returns Boolean Indicates whether the user agent is controlled by automation.
	 * */
	public get webdriver(): boolean {
		return false;
	}
	/**
	 * Readonly doNotTrack.
	 * The value of the property reflects that of the DNT HTTP header, i.e. Values of "1", "0", or "unspecified".
	 *
	 * @returns The user's Do Not Track setting, which indicates whether the user is requesting web sites and advertisers to not track them.
	 **/
	public get doNotTrack(): string {
		return 'unspecified';
	}
	/**
	 * Readonly mimeTypes.
	 *
	 * TODO: NOT ALL IMPL.
	 **/
	public get mimeTypes(): MimeTypeArray {
		return new MimeTypeArray();
	}
	/**
	 * Readonly plugins.
	 *
	 * TODO: NOT ALL IMPL.
	 **/
	public get plugins(): PluginArray {
		return new PluginArray();
	}

	/**
	 * @returns String.
	 */
	public toString(): string {
		return '[object Navigator]';
	}
}
