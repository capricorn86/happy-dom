import Location from '../../location/Location.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import { URL } from 'url';

/**
 * Module initialization options.
 */
export default interface IModuleInit {
	window: BrowserWindow;
	url: URL | Location;
	source: string;
}
