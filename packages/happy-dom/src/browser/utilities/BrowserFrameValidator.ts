import type IBrowserFrame from '../types/IBrowserFrame.js';
import type { URL } from 'url';
import BrowserNavigationCrossOriginPolicyEnum from '../enums/BrowserNavigationCrossOriginPolicyEnum.js';
import type DetachedBrowserFrame from '../detached-browser/DetachedBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * Browser frame validator.
 */
export default class BrowserFrameValidator {
	/**
	 * Returns true if the frame navigation complies with the cross origin policy.
	 *
	 * @param frame Frame.
	 * @param toURL URL.
	 * @returns True if the frame navigation complies with the cross origin policy.
	 */
	public static validateCrossOriginPolicy(frame: IBrowserFrame, toURL: URL): boolean {
		const settings = frame.page.context.browser.settings;
		let fromURL = frame.page.mainFrame.window.location;

		if (frame[PropertySymbol.openerFrame]) {
			fromURL = frame[PropertySymbol.openerFrame].window.location;
		} else if (frame.parentFrame) {
			fromURL = frame.parentFrame.window.location;
		}

		if (
			settings.navigation.crossOriginPolicy === BrowserNavigationCrossOriginPolicyEnum.sameOrigin &&
			fromURL.protocol !== 'about:' &&
			toURL.protocol !== 'about:' &&
			toURL.protocol !== 'javascript:' &&
			fromURL.origin !== toURL.origin
		) {
			return false;
		}

		if (
			settings.navigation.crossOriginPolicy ===
				BrowserNavigationCrossOriginPolicyEnum.strictOrigin &&
			fromURL.protocol === 'https:' &&
			toURL.protocol === 'http:'
		) {
			return false;
		}

		return true;
	}

	/**
	 * Returns true if navigation is allowed for the frame.
	 *
	 * @param frame Frame.
	 * @returns True if navigation is allowed for the frame.
	 */
	public static validateFrameNavigation(frame: IBrowserFrame): boolean {
		const settings = frame.page.context.browser.settings;

		// When using the Window instance directly and not via the Browser API we should not navigate the browser frame.
		// Only a detached browser has a windowClass property and we want to avoid a circular dependency.
		if (
			(<DetachedBrowserFrame>frame).page.context.browser.windowClass &&
			frame.page.context === frame.page.context.browser.defaultContext &&
			frame.page.context.pages[0] === frame.page &&
			frame.page.mainFrame === frame
		) {
			return false;
		}

		if (settings.navigation.disableMainFrameNavigation && frame.page.mainFrame === frame) {
			return false;
		}

		if (settings.navigation.disableChildFrameNavigation && frame.page.mainFrame !== frame) {
			return false;
		}

		if (settings.navigation.disableChildPageNavigation && !!frame[PropertySymbol.openerFrame]) {
			return false;
		}

		return true;
	}
}
