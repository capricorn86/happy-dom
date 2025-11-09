import { BrowserWindow } from 'happy-dom';

/**
 * Browser window polyfill utility.
 */
export default class BrowserWindowPolyfill {
	/**
	 * Applies polyfills to the window object.
	 *
	 * @param window Window.
	 */
	public static applyPolyfills(window: BrowserWindow): void {
		/* eslint-disable jsdoc/require-jsdoc */
		window.HTMLCanvasElement.prototype.getContext = () => ({
			resetTransform: () => {},
			fill: () => {},
			getContextAttributes: () => ({}),
			pixelStorei: () => {},
			getParameter: () => ({}),
			getExtension: () => null,
			createTexture: () => ({}),
			activeTexture: () => {},
			bindTexture: () => {},
			texImage2D: () => {},
			texParameteri: () => {},
			createFramebuffer: () => ({}),
			bindFramebuffer: () => {},
			createRenderbuffer: () => ({}),
			bindRenderbuffer: () => {},
			renderbufferStorage: () => {},
			framebufferRenderbuffer: () => {},
			framebufferTexture2D: () => {},
			createBuffer: () => ({}),
			bindBuffer: () => {},
			bufferData: () => {},
			deleteFramebuffer: () => {},
			deleteRenderbuffer: () => {},
			deleteTexture: () => {},
			viewport: () => {},
			depthMask: () => {},
			enable: () => {},
			depthFunc: () => {},
			disable: () => {},
			stencilMask: () => {},
			stencilFunc: () => {},
			stencilOp: () => {},
			colorMask: () => {},
			clearColor: () => {},
			clearDepth: () => {},
			clear: () => {},
			clearStencil: () => {},
			createShader: () => ({}),
			shaderSource: () => ({}),
			compileShader: () => ({}),
			createProgram: () => ({}),
			attachShader: () => ({}),
			linkProgram: () => ({}),
			getProgramParameter: () => ({}),
			deleteShader: () => ({}),
			getUniformLocation: () => ({}),
			useProgram: () => {},
			uniform1i: () => {},
			cullFace: () => {},
			frontFace: () => {},
			drawElements: () => {},
			copyTexImage2D: () => {},
			generateMipmap: () => {},
			uniform1f: () => {},
			uniform2f: () => {},
			uniform3f: () => {},
			uniform4f: () => {},
			uniformMatrix4fv: () => {},
			bufferSubData: () => {},
			drawElementsInstanced: () => {}
		});
		(<any>window).Worker = class {
			public postMessage(): any {}
			public terminate(): any {}
		};
		(<any>window).Path2D = class {
			public addPath(): any {}
			public addPath2D(): any {}
			public closePath(): any {}
			public moveTo(): any {}
			public lineTo(): any {}
			public arc(): any {}
			public rect(): any {}
			public fill(): any {}
			public stroke(): any {}
		};
		/* eslint-enable jsdoc/require-jsdoc */
	}
}
