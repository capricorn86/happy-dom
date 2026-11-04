import type BrowserWindow from '../../window/BrowserWindow.js';
import type CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import type IBrowserFrame from './IBrowserFrame.js';

/**
 * Reference to the opener frame and window.
 *
 * Contains the frame and window if the frame has access to them, otherwise null.
 */
export default interface IBrowserFrameOpener {
	frame: IBrowserFrame | null;
	window: BrowserWindow | CrossOriginBrowserWindow | null;
}
