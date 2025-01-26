import { apostrophWrapper } from './apostrophWrapper.js';

/* eslint-disable no-undef */

window['moduleLoadOrder'] = window['moduleLoadOrder'] || [];
window['moduleLoadOrder'].push('StringUtilityClass.js');

/**
 * String utility.
 */
export default class StringUtilityClass {
	/**
	 * Converts a string to lower case.
	 *
	 * @param value Value.
	 * @returns {string} Lower case value.
	 */
	static toLowerCase(value) {
		return apostrophWrapper(value.toLowerCase());
	}
}
