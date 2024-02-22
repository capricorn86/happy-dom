import DetachedWindowAPI from './DetachedWindowAPI.js';
import IBrowserWindow from './IBrowserWindow.js';

/**
 * Window.
 */
export default interface IWindow extends IBrowserWindow {
	// Detached Window API.
	readonly happyDOM: DetachedWindowAPI;
}
