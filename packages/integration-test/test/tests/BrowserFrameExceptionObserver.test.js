import { describe, it, expect } from '../utilities/TestFunctions.js';
import { Browser, BrowserErrorCapturingEnum } from 'happy-dom';

describe('BrowserFrameExceptionObserver', () => {
	describe('observe()', () => {
		it('Observes unhandles fetch rejections.', async () => {
			const browser = new Browser({
				settings: { errorCapturing: BrowserErrorCapturingEnum.processLevel }
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

			await new Promise((resolve) => setTimeout(resolve, 2));

			expect(errorEvent instanceof window.ErrorEvent).toBe(true);
			expect(errorEvent.error.message).toBe('Test error');
			expect(errorEvent.message).toBe('Test error');

			await browser.close();
		});

		it('Observes uncaught exceptions.', async () => {
			const browser = new Browser({
				settings: { errorCapturing: BrowserErrorCapturingEnum.processLevel }
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

			await new Promise((resolve) => setTimeout(resolve, 2));

			const consoleOutput = page.virtualConsolePrinter.readAsString();

			expect(consoleOutput.startsWith('Error: Test error\n    at Timeout.eval')).toBe(true);
			expect(errorEvent instanceof window.ErrorEvent).toBe(true);
			expect(errorEvent.error.message).toBe('Test error');
			expect(errorEvent.message).toBe('Test error');

			await browser.close();
		});
	});

	describe('disconnect()', () => {
		it('Disconnects the observer.', async () => {
			expect(process.listenerCount('uncaughtException')).toBe(0);
			expect(process.listenerCount('unhandledRejection')).toBe(0);
		});
	});
});
