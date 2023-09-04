import { Window, ErrorEvent } from 'happy-dom';
import ErrorObserver from '../src/ErrorObserver.js';
import { afterEach, describe, it, vi } from 'vitest';

describe('ErrorObserver', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('observe()', () => {
		it('Observers synchrounous errors inside a Happy DOM Window instance.', () => {
			const window = new Window();
			const document = window.document;
			const observer = new ErrorObserver();
			let errorEvent: ErrorEvent | null = null;

			observer.observe(window);

			window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));

			document.write(`
                <script>
                    throw new Error('Test error');
                </script>
            `);

			expect(errorEvent).toBeInstanceOf(window.ErrorEvent);
			expect((<ErrorEvent>(<unknown>errorEvent)).error).toBeInstanceOf(window.Error);
			expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBeInstanceOf('Test error');
			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBeInstanceOf('Test error');
		});
	});
});
