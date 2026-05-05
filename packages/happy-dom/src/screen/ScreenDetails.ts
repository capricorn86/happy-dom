import EventTarget from '../event/EventTarget.js';
import ScreenDetailed from './ScreenDetailed.js';
import type Event from '../event/Event.js';

/**
 * ScreenDetails.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ScreenDetails
 */
export default class ScreenDetails extends EventTarget {
	public readonly currentScreen: ScreenDetailed;
	public readonly screens: ScreenDetailed[];

	// Event handlers
	public oncurrentscreenchange: ((event: Event) => void) | null = null;
	public onscreenschange: ((event: Event) => void) | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		const screen = new ScreenDetailed();
		this.currentScreen = screen;
		this.screens = [screen];
	}
}
