import GlobalRegistrator from '../../cjs/GlobalRegistrator.cjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import ReactComponent from './ReactComponent.js';

async function main(): Promise<void> {
	const selfReferringProperties = ['self', 'top', 'parent', 'window'];

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const originalSetTimeout = global.setTimeout;

	GlobalRegistrator.register();

	const appElement = document.createElement('app');
	let root;
	document.body.appendChild(appElement);

	async function mountReactComponent(): Promise<void> {
		act(() => {
			root = ReactDOM.createRoot(appElement);
			root.render(<ReactComponent />);
		});

		await new Promise((resolve) => setTimeout(resolve, 2));

		if (appElement.innerHTML !== '<div>Test</div>') {
			throw Error('React not rendered correctly.');
		}
	}

	function unmountReactComponent(): void {
		act(() => {
			root.unmount();
		});

		if (appElement.innerHTML !== '') {
			throw Error('React not unmounted correctly.');
		}
	}

	if (global.setTimeout === originalSetTimeout) {
		throw Error('Happy DOM function not registered.');
	}

	for (const property of selfReferringProperties) {
		if (global[property] !== global) {
			throw Error('Self referring property property was not registered.');
		}
	}

	/** @see https://github.com/capricorn86/happy-dom/issues/1230 */
	globalThis.location.href = 'https://example.com/';
	if (globalThis.location.href !== 'https://example.com/') {
		throw Error('The property "location.href" could not be set.');
	}

	await mountReactComponent();
	unmountReactComponent();

	GlobalRegistrator.unregister();

	if (global.setTimeout !== originalSetTimeout) {
		throw Error('Global property was not restored.');
	}
}

main();
