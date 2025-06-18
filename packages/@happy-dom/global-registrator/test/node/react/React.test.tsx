import GlobalRegistrator from '../../../lib/GlobalRegistrator.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import ReactComponent from './ReactComponent.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('React', () => {
	it('Tests integration.', async () => {
		GlobalRegistrator.register();

		const appElement = document.createElement('app');
		let root: ReactDOM.Root | null = null;
		document.body.appendChild(appElement);

		async function mountReactComponent(): Promise<void> {
			act(() => {
				root = ReactDOM.createRoot(appElement);
				root.render(<ReactComponent />);
			});

			await new Promise((resolve) => setTimeout(resolve, 2));

			assert.strictEqual(appElement.innerHTML, '<div>Test</div>');
		}

		function unmountReactComponent(): void {
			act(() => {
				root!.unmount();
			});

			assert.strictEqual(appElement.innerHTML, '');
		}

		await mountReactComponent();
		unmountReactComponent();

		GlobalRegistrator.unregister();
	});
});
