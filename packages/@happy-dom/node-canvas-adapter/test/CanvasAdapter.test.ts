import { ImageData, Window, Blob } from 'happy-dom';
import type { Document } from 'happy-dom';
import CanvasAdapter from '../src/CanvasAdapter.js';
import { describe, it, expect, beforeEach } from 'vitest';
import FS from 'fs';
import Path from 'path';

async function writeSnapshotImage(dataURL: string, snapshotName: string): Promise<void> {
	const snapshotPath = Path.resolve(`./test/__snapshots__/${snapshotName}`);
	await FS.promises.writeFile(snapshotPath, Buffer.from(dataURL.split(',')[1], 'base64'));
}

describe('CanvasAdapter', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window({
			settings: {
				canvasAdapter: new CanvasAdapter(),
				enableImageFileLoading: true,
				fetch: {
					virtualServers: [
						{
							url: 'https://example.com/images',
							directory: './test/'
						}
					]
				}
			}
		});
		document = window.document;
	});

	describe('getContext()', () => {
		it('Should return 2d context for "2d" context type.', () => {
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');

			expect(context).toBeDefined();
			expect(typeof context).toBe('object');
		});

		it('Should return null for unsupported context types.', () => {
			const canvas = document.createElement('canvas');

			expect(canvas.getContext('webgl')).toBe(null);
			expect(canvas.getContext('webgl2')).toBe(null);
			expect(canvas.getContext('webgpu')).toBe(null);
			expect(canvas.getContext('bitmaprenderer')).toBe(null);
		});

		it('Should return the same context instance for the same canvas.', () => {
			const canvas = document.createElement('canvas');
			const context1 = canvas.getContext('2d');
			const context2 = canvas.getContext('2d');

			expect(context1).toBe(context2);
		});

		it('Should return different context instances for different canvas objects.', () => {
			const canvas = document.createElement('canvas');
			const canvas2 = document.createElement('canvas');
			const context1 = canvas.getContext('2d');
			const context2 = canvas2.getContext('2d');

			expect(context1).not.toBe(context2);
		});

		describe('drawImage()', () => {
			it('Draws an Image on the canvas', async () => {
				const image = new window.Image();
				image.src = 'https://example.com/images/test.gif';

				const canvas = document.createElement('canvas');
				canvas.width = 640;
				canvas.height = 480;
				const context = canvas.getContext('2d')!;

				context.drawImage(image, 0, 0);

				await new Promise((resolve) => (image.onload = resolve));

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-drawImage-Image.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Draws an HTMLImageElement on the canvas', async () => {
				const image = document.createElement('img');
				image.src = 'https://example.com/images/test.gif';

				const canvas = document.createElement('canvas');
				canvas.width = 640;
				canvas.height = 480;
				const context = canvas.getContext('2d')!;

				context.drawImage(image, 0, 0);

				await new Promise((resolve) => (image.onload = resolve));

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-drawImage-HTMLImageElement.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Draws an HTMLCanvasElement on the canvas', async () => {
				const image = new window.Image();
				image.src = 'https://example.com/images/test.gif';

				const sourceCanvas = document.createElement('canvas');
				const canvas = document.createElement('canvas');

				sourceCanvas.width = 640;
				sourceCanvas.height = 480;
				canvas.width = 640;
				canvas.height = 480;

				const sourceContext = sourceCanvas.getContext('2d')!;
				const context = canvas.getContext('2d')!;

				sourceContext.drawImage(image, 0, 0);

				await new Promise((resolve) => (image.onload = resolve));

				context.drawImage(sourceCanvas, 0, 0);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-drawImage-HTMLCanvasElement.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Draws an OffscreenCanvas on the canvas', async () => {
				const image = new window.Image();
				image.src = 'https://example.com/images/test.gif';

				const sourceCanvas = new window.OffscreenCanvas(640, 480);
				const canvas = document.createElement('canvas');

				canvas.width = 640;
				canvas.height = 480;

				const sourceContext = sourceCanvas.getContext('2d')!;
				const context = canvas.getContext('2d')!;

				sourceContext.drawImage(image, 0, 0);

				await new Promise((resolve) => (image.onload = resolve));

				context.drawImage(sourceCanvas, 0, 0);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-drawImage-OffscreenCanvas.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot(snapshot);
			});

			it('Draws an ImageBitmap on the canvas', async () => {
				const image = new window.Image();
				image.src = 'https://example.com/images/test.gif';

				await new Promise((resolve) => (image.onload = resolve));

				const imageBitmap = await window.createImageBitmap(image, 50, 50, 100, 100);

				const canvas = document.createElement('canvas');
				canvas.width = 640;
				canvas.height = 480;
				const context = canvas.getContext('2d')!;

				context.drawImage(imageBitmap, 50, 50);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-drawImage-ImageBitmap.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Does not draw an HTMLVideoElement on the canvas', async () => {
				const video = document.createElement('video');
				const canvas = document.createElement('canvas');
				canvas.width = 640;
				canvas.height = 480;
				const context = canvas.getContext('2d')!;

				context.drawImage(video, 0, 0);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-drawImage-HTMLVideoElement.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});
		});

		describe('createImageData()', () => {
			it('Creates an ImageData object with the specified dimensions.', () => {
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d')!;
				const imageData = context.createImageData(100, 50);

				expect(imageData).toBeInstanceOf(ImageData);
				expect(imageData.width).toBe(100);
				expect(imageData.height).toBe(50);
				expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);
				expect(imageData.data.length).toBe(100 * 50 * 4); // width * height * RGBA
			});
		});

		describe('putImageData()', () => {
			it('Puts ImageData onto the canvas at the specified coordinates.', () => {
				const canvas = document.createElement('canvas');
				canvas.width = 200;
				canvas.height = 100;
				const context = canvas.getContext('2d')!;

				const imageData = context.createImageData(50, 50);
				for (let i = 0; i < imageData.data.length; i += 4) {
					imageData.data[i] = 255; // Red
					imageData.data[i + 1] = 0; // Green
					imageData.data[i + 2] = 0; // Blue
					imageData.data[i + 3] = 255; // Alpha
				}

				context.putImageData(imageData, 25, 25);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-putImageData.png';

				writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Puts ImageData created from window onto the canvas', () => {
				const canvas = document.createElement('canvas');
				canvas.width = 200;
				canvas.height = 100;
				const context = canvas.getContext('2d')!;

				const imageData = new window.ImageData(50, 50);
				for (let i = 0; i < imageData.data.length; i += 4) {
					imageData.data[i] = 255; // Red
					imageData.data[i + 1] = 0; // Green
					imageData.data[i + 2] = 0; // Blue
					imageData.data[i + 3] = 255; // Alpha
				}

				context.putImageData(imageData, 25, 25);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-putImageData-WindowImageData.png';

				writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});
		});

		describe('getImageData()', () => {
			it('Gets ImageData from the canvas at the specified coordinates.', () => {
				const canvas = document.createElement('canvas');
				canvas.width = 200;
				canvas.height = 100;
				const context = canvas.getContext('2d')!;
				context.fillStyle = 'red';
				context.fillRect(0, 0, 50, 50);

				const imageData = context.getImageData(0, 0, 50, 50);

				expect(imageData).toBeInstanceOf(ImageData);
				expect(imageData.width).toBe(50);
				expect(imageData.height).toBe(50);
				expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);

				for (let i = 0; i < imageData.data.length; i += 4) {
					expect(imageData.data[i]).toBe(255); // Red
					expect(imageData.data[i + 1]).toBe(0); // Green
					expect(imageData.data[i + 2]).toBe(0); // Blue
					expect(imageData.data[i + 3]).toBe(255); // Alpha
				}
			});
		});

		describe('createPattern()', () => {
			it('Creates a pattern using an HTMLImageElement.', async () => {
				const image = document.createElement('img');
				image.src = 'https://example.com/images/test.gif';
				await new Promise((resolve) => (image.onload = resolve));

				const canvas = document.createElement('canvas');
				canvas.width = 800;
				canvas.height = 600;
				const context = canvas.getContext('2d')!;
				const pattern = context.createPattern(image, 'repeat')!;

				context.fillStyle = pattern;
				context.fillRect(0, 0, 800, 600);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-createPattern-HTMLImageElement.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Creates a pattern using an ImageBitmap.', async () => {
				const image = new window.Image();
				image.src = 'https://example.com/images/test.gif';
				await new Promise((resolve) => (image.onload = resolve));

				const imageBitmap = await window.createImageBitmap(image, 50, 50, 100, 100);
				const canvas = document.createElement('canvas');
				canvas.width = 800;
				canvas.height = 600;
				const context = canvas.getContext('2d')!;
				const pattern = context.createPattern(imageBitmap, 'repeat')!;

				context.fillStyle = pattern;
				context.fillRect(0, 0, 800, 600);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-createPattern-ImageBitmap.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Creates a pattern using an HTMLCanvasElement.', async () => {
				const image = new window.Image();
				image.src = 'https://example.com/images/test.gif';
				await new Promise((resolve) => (image.onload = resolve));

				const imageBitmap = await window.createImageBitmap(image, 50, 50, 100, 100);

				const sourceCanvas = document.createElement('canvas');
				sourceCanvas.width = 200;
				sourceCanvas.height = 200;
				const sourceContext = sourceCanvas.getContext('2d')!;
				sourceContext.drawImage(imageBitmap, 0, 0);

				const canvas = document.createElement('canvas');
				canvas.width = 800;
				canvas.height = 600;
				const context = canvas.getContext('2d')!;
				const pattern = context.createPattern(sourceCanvas, 'repeat')!;

				context.fillStyle = pattern;
				context.fillRect(0, 0, 800, 600);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-createPattern-HTMLCanvasElement.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Creates a pattern using an OffscreenCanvas.', async () => {
				const image = new window.Image();
				image.src = 'https://example.com/images/test.gif';
				await new Promise((resolve) => (image.onload = resolve));

				const imageBitmap = await window.createImageBitmap(image, 50, 50, 100, 100);

				const sourceCanvas = new window.OffscreenCanvas(200, 200);
				const sourceContext = sourceCanvas.getContext('2d')!;
				sourceContext.drawImage(imageBitmap, 0, 0);

				const canvas = document.createElement('canvas');
				canvas.width = 800;
				canvas.height = 600;
				const context = canvas.getContext('2d')!;
				const pattern = context.createPattern(sourceCanvas, 'repeat')!;

				context.fillStyle = pattern;
				context.fillRect(0, 0, 800, 600);

				const dataURL = canvas.toDataURL();
				const snapshot = 'CanvasAdapter.test.ts-createPattern-HTMLCanvasElement.png';

				await writeSnapshotImage(dataURL, snapshot);
				expect(dataURL).toMatchSnapshot();
			});

			it('Returns null for unsupported pattern types.', () => {
				const canvas = document.createElement('canvas');
				canvas.width = 800;
				canvas.height = 600;

				const context = canvas.getContext('2d')!;
				const pattern = context.createPattern(<any>document.createElement('div'), 'repeat');

				expect(pattern).toBeNull();
			});
		});
	});

	describe('toDataURL()', () => {
		it('Should return a valid data URL for PNG format.', () => {
			const canvas = document.createElement('canvas');
			const dataURL = canvas.toDataURL();

			expect(dataURL).toMatch(/^data:image\/png;base64,/);
		});

		it('Should return a valid data URL for JPEG format.', () => {
			const canvas = document.createElement('canvas');
			const dataURL = canvas.toDataURL('image/jpeg', 0.8);

			expect(dataURL).toMatch(/^data:image\/jpeg;base64,/);
		});

		it('Should return different data URLs for different canvas sizes.', () => {
			const canvas = document.createElement('canvas');
			const canvas2 = document.createElement('canvas');

			canvas.width = 100;
			canvas.height = 100;
			canvas2.width = 200;
			canvas2.height = 200;

			canvas.getContext('2d');
			canvas2.getContext('2d');

			const dataURL1 = canvas.toDataURL();
			const dataURL2 = canvas2.toDataURL();

			expect(dataURL1).not.toBe(dataURL2);
		});
	});

	describe('toBlob()', () => {
		it('Should create a PNG blob and call the callback.', async () => {
			const canvas = document.createElement('canvas');
			canvas.width = 100;
			canvas.height = 100;

			const blob = await new Promise<Blob | null>((resolve) => {
				canvas.toBlob(resolve);
			});

			expect(blob).toBeDefined();
			expect(blob).toBeInstanceOf(Blob);
			expect(blob?.type).toBe('image/png');
		});

		it('Should create a JPEG blob with quality setting.', async () => {
			const canvas = document.createElement('canvas');
			canvas.width = 100;
			canvas.height = 100;

			const blob = await new Promise<Blob | null>((resolve) => {
				canvas.toBlob(resolve, 'image/jpeg', 0.8);
			});

			expect(blob).toBeDefined();
			expect(blob).toBeInstanceOf(Blob);
			expect(blob?.type).toBe('image/jpeg');
		});

		it('Should return the canvas as a Blob with the correct data.', async () => {
			const canvas = document.createElement('canvas');
			canvas.width = 100;
			canvas.height = 100;
			const context = canvas.getContext('2d')!;
			context.fillStyle = 'red';
			context.fillRect(0, 0, 100, 100);

			const blob = await new Promise<Blob | null>((resolve) => {
				canvas.toBlob(resolve);
			});

			expect(blob).toBeDefined();
			expect(blob).toBeInstanceOf(Blob);
			expect(blob?.type).toBe('image/png');

			const arrayBuffer = await blob!.arrayBuffer();
			const uint8Array = new Uint8Array(arrayBuffer);

			// Check PNG signature (first 8 bytes)
			const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
			for (let i = 0; i < pngSignature.length; i++) {
				expect(uint8Array[i]).toBe(pngSignature[i]);
			}
		});
	});
});
