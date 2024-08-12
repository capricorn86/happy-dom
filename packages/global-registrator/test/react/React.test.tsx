import GlobalRegistrator from '../../cjs/GlobalRegistrator.cjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import ReactComponent from './ReactComponent.js';

const GETTERS = [
	'location',
	'history',
	'navigator',
	'screen',
	'sessionStorage',
	'localStorage',
	'opener',
	'scrollX',
	'pageXOffset',
	'scrollY',
	'pageYOffset',
	'CSS',
	'innerWidth',
	'innerHeight',
	'outerWidth',
	'outerHeight',
	'devicePixelRatio'
];

async function main(): Promise<void> {
	const selfReferringProperties = ['self', 'top', 'parent', 'window'];

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const originalSetTimeout = global.setTimeout;

	/**
	 * Registers Happy DOM globally.
	 */
	GlobalRegistrator.register();

	/**
	 * Test if all properties defined as getter are included in the global object.
	 */
	function testGetters(): void {
		const included: string[] = [];
		const propertyNames = Object.getOwnPropertyNames(global);

		for (const name of GETTERS) {
			if (propertyNames.includes(name)) {
				included.push(name);
			}
		}

		if (included.length !== GETTERS.length) {
			throw Error(
				`Object.getOwnPropertyNames() did not return all properties defined as getter. Expected: "${GETTERS.join(', ')}", Got: "${included.join(', ')}".`
			);
		}
	}

	testGetters();

	/**
	 * Test if it is possible to create a React component and mount it.
	 */
	async function testReactComponent(): Promise<void> {
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

		await mountReactComponent();
		unmountReactComponent();
	}

	await testReactComponent();

	/**
	 * Test if it is possible to set the location.href property and that location isn't replaced to a new object.
	 *
	 * @see https://github.com/capricorn86/happy-dom/issues/1230
	 * */
	function testLocationHref(): void {
		globalThis.location.href = 'https://example.com/';
		if (globalThis.location.href !== 'https://example.com/') {
			throw Error('The property "location.href" could not be set.');
		}
	}

	testLocationHref();

	/**
	 * Test CSS.
	 */
	function testCSS(): void {
		const style = document.createElement('style');
		document.head.appendChild(style);
		style.innerHTML = `
            body {
                background-color: red;
            }

            @media (min-width: 1000px) {
                body {
                    background-color: green;
                }
            }
        `;

		if (globalThis.getComputedStyle(document.body).backgroundColor !== 'green') {
			throw Error('The CSS was not applied correctly.');
		}
	}

	testCSS();

	/**
	 * Unregisters Happy DOM globally.
	 */
	GlobalRegistrator.unregister();

	/**
	 * Test if all properties defined as getter are removed from the global object.
	 */
	function testGettersAfterUnregister(): void {
		const included: string[] = [];
		const propertyNames = Object.getOwnPropertyNames(global);

		for (const name of GETTERS) {
			if (propertyNames.includes(name)) {
				included.push(name);
			}
		}

		// In Node.js v21 and later, the navigator property is available.
		if (!included.includes('navigator')) {
			included.push('navigator');
		}

		if (included.length !== 1 || included[0] !== 'navigator') {
			throw Error(
				`GlobalObserver.unregister() did not remove all properties defined as getter. Expected: "navigator", Got: "${included.join(', ')}".`
			);
		}
	}

	testGettersAfterUnregister();

	/**
	 * Test if setTimeout is restored.
	 */
	function testSetTimeout(): void {
		if (global.setTimeout !== originalSetTimeout) {
			throw Error('Global property was not restored.');
		}
	}

	testSetTimeout();

	/**
	 * Test registering with options.
	 */
	function testWindowOptions(): void {
		GlobalRegistrator.register({
			url: 'https://example.com/',
			width: 1920,
			height: 1080,
			settings: {
				navigator: {
					userAgent: 'Custom User Agent'
				}
			}
		});

		if (globalThis.location.href !== 'https://example.com/') {
			throw Error('The option "url" has no affect.');
		}

		if (globalThis.innerWidth !== 1920) {
			throw Error('The option "width" has no affect.');
		}

		if (globalThis.innerHeight !== 1080) {
			throw Error('The option "height" has no affect.');
		}

		if (globalThis.navigator.userAgent !== 'Custom User Agent') {
			throw Error('The option "settings.userAgent" has no affect.');
		}

		GlobalRegistrator.unregister();
	}

	testWindowOptions();
}

main();
