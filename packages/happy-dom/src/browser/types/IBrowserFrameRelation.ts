import type BrowserWindow from '../../window/BrowserWindow.js';
import type CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import type IBrowserFrame from './IBrowserFrame.js';

interface IBrowserFrameRelationWindow {
	frame: IBrowserFrame;
	window: BrowserWindow | CrossOriginBrowserWindow;
}

/**
 * Browser frame access between a frame and its ancestors.
 */
export default interface IBrowserFrameRelation {
	type: 'parent' | 'opener';
	parent: IBrowserFrameRelationWindow;
	child: IBrowserFrameRelationWindow;
}
