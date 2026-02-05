import type Location from '../../location/Location.js';
import type BrowserWindow from '../../window/BrowserWindow.js';
import type { URL } from 'url';

/**
 * Module initialization options.
 */
export default interface IModuleInit {
	window: BrowserWindow;
	url: URL | Location;
	source: string;
}
