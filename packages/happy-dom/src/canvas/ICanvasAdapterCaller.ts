import type IBrowserFrame from '../browser/types/IBrowserFrame.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import type ICanvasShape from './ICanvasShape.js';

export default interface ICanvasAdapterCaller {
	window: BrowserWindow;
	browserFrame: IBrowserFrame;
	canvas: ICanvasShape;
}
