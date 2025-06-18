import { Browser, BrowserErrorCaptureEnum } from 'happy-dom';
import assert from 'node:assert';

let description = '';

/* eslint-disable no-console */

// We can't use the node testing framework here, because it will collide with the Browser error capturing.

async function describe(name, fn) {
	description = name;
	await fn(fn);
}

async function it(name, fn) {
	console.log('> ' + description + ' ' + name);
	await fn();
}

await describe('BrowserExceptionObserver', async () => {
	await describe('observe()', async () => {
		await it('Observes unhandled fetch rejections.', async () => {
			const browser = new Browser({
				settings: { errorCapture: BrowserErrorCaptureEnum.processLevel }
			});
			const page = browser.newPage();
			const window = page.mainFrame.window;
			const document = window.document;
			let errorEvent = null;

			window.addEventListener('error', (event) => (errorEvent = event));

			window.fetch = () => {
				return new Promise((resolve) => setTimeout(() => resolve({}), 0));
			};

			document.write(`
                <script>
                    (() => {
                        async function main() {
                            await fetch('http://localhost:3000/get/json');
                            throw new Error('Test error');
                        }
        
                        main();
                    })();
                </script>
            `);

			await new Promise((resolve) => setTimeout(resolve, 10));

			assert.strictEqual(errorEvent instanceof window.ErrorEvent, true);
			assert.strictEqual(errorEvent.error.message, 'Test error');
			assert.strictEqual(errorEvent.message, 'Test error');

			await browser.close();
		});

		await it('Observes uncaught exceptions.', async () => {
			const browser = new Browser({
				settings: { errorCapture: BrowserErrorCaptureEnum.processLevel }
			});
			const page = browser.newPage();
			const window = page.mainFrame.window;
			const document = window.document;
			let errorEvent = null;

			window.addEventListener('error', (event) => (errorEvent = event));
			window['customSetTimeout'] = setTimeout.bind(global);

			document.write(`
                <script>
                    (() => {
                        function main() {
                            customSetTimeout(() => {
                                throw new Error('Test error');
                            }, 0);
                        }

                        main();
                    })();
                </script>
            `);

			await new Promise((resolve) => setTimeout(resolve, 10));

			const consoleOutput = page.virtualConsolePrinter.readAsString();

			assert.strictEqual(consoleOutput.startsWith('Error: Test error\n    at Timeout.eval'), true);
			assert.strictEqual(errorEvent instanceof window.ErrorEvent, true);
			assert.strictEqual(errorEvent.error.message, 'Test error');
			assert.strictEqual(errorEvent.message, 'Test error');

			await browser.close();
		});
	});

	await describe('disconnect()', () => {
		it('Disconnects the observer.', async () => {
			assert.strictEqual(process.listenerCount('uncaughtException'), 0);
			assert.strictEqual(process.listenerCount('unhandledRejection'), 0);
		});
	});
});
