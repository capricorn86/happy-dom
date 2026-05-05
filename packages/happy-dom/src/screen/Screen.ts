import EventTarget from '../event/EventTarget.js';
import type Event from '../event/Event.js';

/**
 * The Screen interface represents a screen, usually the one on which the current window is being rendered.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen
 */
export default class Screen extends EventTarget {
	public readonly width = 1024;
	public readonly height = 768;
	public readonly availWidth = 1024;
	public readonly availHeight = 768;
	public readonly colorDepth = 24;
	public readonly pixelDepth = 24;

	// Event handler
	public onchange: ((event: Event) => void) | null = null;
}
