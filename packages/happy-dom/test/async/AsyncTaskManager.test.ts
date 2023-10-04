import IWindow from '../../src/window/IWindow.js';
import Window from '../../src/window/Window.js';
import IDocument from '../../src/nodes/document/IDocument.js';
import Response from '../../src/fetch/Response.js';
import FetchBodyUtility from '../../src/fetch/utilities/FetchBodyUtility.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

describe('AsyncTaskManager', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		Response._ownerDocument = document;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('Nested `setTimeouts` are detected with `whenComplete()`', async () => {
		let inOrder = '';

		window.console.log = (a: string) => (inOrder += a);

		window.document.write(`
      <script>
        setTimeout(() => { 
          console.log('A');

          setTimeout(() => console.log('B'));
        });
      </script>
    `);

		await window.happyDOM.whenAsyncComplete();

		expect(inOrder).toBe('AB');
	});

	it('Nested async functions are detected with `whenComplete()`', async () => {
		let inOrder = '';

		window.console.log = (a: string) => (inOrder += a);

		window.document.write(`
      <script>
        setTimeout(async () => { 
          console.log('A');

          setTimeout(async () => { 
            console.log('B');
  
            setTimeout(async () => { 
              console.log('C');
    
              setTimeout(async () => console.log('D'));
            });
          });
        });
      </script>
    `);

		await window.happyDOM.whenAsyncComplete();

		expect(inOrder).toBe('ABCD');
	});

	it('Supports AsyncTaskManager.whenComplete() with multiple calls', async () => {
		await new Promise((resolve) => {
			const response = new Response('Hello World');
			let countComplete = 0;

			vi.spyOn(FetchBodyUtility, 'consumeBodyStream').mockImplementation(
				(): Promise<Buffer> =>
					new Promise((resolve) => setTimeout(() => resolve(Buffer.from('Hello World')), 50))
			);

			window.happyDOM.whenAsyncComplete().then(() => countComplete++);
			window.happyDOM.whenAsyncComplete().then(() => countComplete++);
			window.happyDOM.whenAsyncComplete().then(() => countComplete++);

			setTimeout(() => {
				// Should all have completed immediately
				expect(countComplete).toBe(3);

				// Timing of these 3 should not matter, all are in the duration of `.arrayBuffer()`
				window.happyDOM.whenAsyncComplete().then(() => countComplete++);
				setTimeout(() => window.happyDOM.whenAsyncComplete().then(() => countComplete++), 10);
				setTimeout(() => window.happyDOM.whenAsyncComplete().then(() => countComplete++), 20);

				response.arrayBuffer();

				// Check nothing happened
				setTimeout(() => expect(countComplete).toBe(3), 2);

				setTimeout(() => {
					// Now ready
					expect(countComplete).toBe(6);

					// Check again if env is all is clean with different timings
					window.happyDOM.whenAsyncComplete().then(() => countComplete++);
					setTimeout(() => window.happyDOM.whenAsyncComplete().then(() => countComplete++), 5);
					window.happyDOM.whenAsyncComplete().then(() => countComplete++);

					// Should all have completed immediately
					setTimeout(() => {
						expect(countComplete).toBe(9);
						resolve(null);
					}, 10);
				}, 60);
			}, 2);
		});
	});
});
