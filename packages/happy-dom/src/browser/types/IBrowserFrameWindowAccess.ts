import type BrowserWindow from '../../window/BrowserWindow.js';
import type CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import type IBrowserFrame from './IBrowserFrame.js';

/**
 * Browser frame window access between frames cross origin or same origin.
 */
export default interface IBrowserFrameWindowAccess {
	frame: IBrowserFrame;
	window: BrowserWindow | CrossOriginBrowserWindow | null;
	// Indicates if the window access is restricted due to noreferrer.
	noreferrer?: boolean;
}
