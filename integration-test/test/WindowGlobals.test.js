import { Window } from 'happy-dom';
import assert from 'node:assert';
import { describe, it } from 'node:test';

describe('WindowGlobals', () => {
	it('Functions should have the constructor global.Function.', () => {
		const window = new Window({ settings: { enableJavaScriptEvaluation: true } });
		let error = null;
		window.addEventListener('error', (event) => (error = event.error));
		window.document.write(`
            <script>
                if((() => {}).constructor !== Function) {
                    throw new Error('Error');
                }
            </script>
        `);
		assert.strictEqual(error, null);
	});

	it('Object should have the constructor global.Object.', () => {
		const window = new Window({ settings: { enableJavaScriptEvaluation: true } });
		let error = null;
		window.addEventListener('error', (event) => (error = event.error));
		window.document.write(`
            <script>
                if({}.constructor !== Object) {
                    throw new Error('Error');
                }
            </script>
        `);
		assert.strictEqual(error, null);
	});

	it('Binds global methods to the Window context.', () => {
		const window = new Window({ settings: { enableJavaScriptEvaluation: true } });
		let error = null;
		window.addEventListener('error', (event) => (error = event.error));
		window.document.write(`
            <script>
                const eventListener = () => {};
                addEventListener('click', eventListener);
                removeEventListener('click', eventListener);
                clearTimeout(setTimeout(eventListener));
            </script>
        `);
		assert.strictEqual(error, null);
	});
});
