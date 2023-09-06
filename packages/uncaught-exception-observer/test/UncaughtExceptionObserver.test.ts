import { Window, ErrorEvent } from 'happy-dom';
import UncaughtExceptionObserver from '../lib/UncaughtExceptionObserver.js';

async function itObservesUnhandledRejections(): Promise<void> {
	const window = new Window();
	const document = window.document;
	const observer = new UncaughtExceptionObserver();
	let errorEvent: ErrorEvent | null = null;

	observer.observe(window);

	window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

	window.fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 0));
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

	observer.disconnect();

	if (!(errorEvent instanceof window.ErrorEvent)) {
		throw new Error('Error event not dispatched.');
	}

	if (errorEvent.error.message !== 'Test error') {
		throw new Error('Error message not correct.');
	}

	if (errorEvent.message !== 'Test error') {
		throw new Error('Error message not correct.');
	}
}

async function itObservesUncaughtExceptions(): Promise<void> {
	const window = new Window();
	const document = window.document;
	const observer = new UncaughtExceptionObserver();
	let errorEvent: ErrorEvent | null = null;

	observer.observe(window);

	window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

	window['customSetTimeout'] = setTimeout.bind(globalThis);

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

	observer.disconnect();

	const consoleOutput = window.happyDOM.virtualConsolePrinter.readAsString();

	if (consoleOutput.startsWith('Error: Test error\nat Timeout.eval')) {
		throw new Error(`Console output not correct.`);
	}

	if (!(errorEvent instanceof window.ErrorEvent)) {
		throw new Error('Error event not dispatched.');
	}

	if (errorEvent.error.message !== 'Test error') {
		throw new Error('Error message not correct.');
	}

	if (errorEvent.message !== 'Test error') {
		throw new Error('Error message not correct.');
	}
}

async function main(): Promise<void> {
	try {
		await itObservesUnhandledRejections();
		await itObservesUncaughtExceptions();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		process.exit(1);
	}
}

main();
