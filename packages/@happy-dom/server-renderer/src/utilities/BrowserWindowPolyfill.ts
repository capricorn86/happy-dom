import type { BrowserWindow, IBrowserSettings } from 'happy-dom';

/**
 * Browser window polyfill utility.
 */
export default class BrowserWindowPolyfill {
	/**
	 * Applies polyfills to the window object.
	 *
	 * @param window Window.
	 * @param settings Browser settings.
	 */
	public static applyPolyfills(window: BrowserWindow, settings: IBrowserSettings): void {
		if (!settings.canvasAdapter) {
			window.HTMLCanvasElement.prototype.getContext = (type) => {
				if (type !== '2d') {
					return null;
				}
				return {
					imageSmoothingEnabled: true,
					globalCompositeOperation: 'source-over',
					globalAlpha: 1,
					shadowColor: 'rgba(0, 0, 0, 0)',
					miterLimit: 10,
					lineWidth: 1,
					lineCap: 'butt',
					lineJoin: 'miter',
					lineDashOffset: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					shadowBlur: 0,
					fillStyle: '#000000',
					strokeStyle: '#000000',
					font: '10px sans-serif',
					textBaseline: 'alphabetic',
					textAlign: 'start',
					canvas: window.HTMLCanvasElement.prototype,
					direction: 'ltr',
					lang: '',
					drawImage: () => {},
					putImageData: () => {},
					getImageData: () => new window.ImageData(1, 1),
					createImageData: () => new window.ImageData(1, 1),
					save: () => {},
					restore: () => {},
					rotate: () => {},
					translate: () => {},
					transform: () => {},
					getTransform: () => new window.DOMMatrix(),
					resetTransform: () => {},
					setTransform: () => {},
					isPointInPath: () => false,
					scale: () => {},
					clip: () => {},
					fill: () => {},
					stroke: () => {},
					fillText: () => {},
					strokeText: () => {},
					fillRect: () => {},
					strokeRect: () => {},
					clearRect: () => {},
					rect: () => {},
					roundRect: () => {},
					measureText: (text) =>
						<any>{
							width: text.length * 10
						},
					moveTo: () => {},
					lineTo: () => {},
					bezierCurveTo: () => {},
					quadraticCurveTo: () => {},
					beginPath: () => {},
					closePath: () => {},
					arc: () => {},
					arcTo: () => {},
					ellipse: () => {},
					setLineDash: () => {},
					getLineDash: () => [],
					createPattern: () => <any>{},
					createLinearGradient: () => <any>{},
					createRadialGradient: () => <any>{},
					beginTag: () => {},
					endTag: () => {}
				};
			};
		}
		(<any>window).Worker = class Worker {
			/**
			 *
			 */
			public postMessage(): any {}
			/**
			 *
			 */
			public terminate(): any {}
		};

		(<any>window).Path2D = class Path2D {
			/**
			 *
			 */
			public addPath(): any {}
			/**
			 *
			 */
			public addPath2D(): any {}
			/**
			 *
			 */
			public closePath(): any {}
			/**
			 *
			 */
			public moveTo(): any {}
			/**
			 *
			 */
			public lineTo(): any {}
			/**
			 *
			 */
			public arc(): any {}
			/**
			 *
			 */
			public rect(): any {}
			/**
			 *
			 */
			public fill(): any {}
			/**
			 *
			 */
			public stroke(): any {}
		};
		/* eslint-enable jsdoc/require-jsdoc */
	}
}
