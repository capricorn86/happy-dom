import GlobalRegistrator from '../../lib/GlobalRegistrator.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';

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

const ORIGINAL_SET_TIMEOUT = global.setTimeout;
const SELF_REFERRING_PROPERTIES = ['self', 'top', 'parent', 'window'];

describe('GlobalRegistrator', () => {
	describe('register()', () => {
		it('Has applied properties and getters to the global object', async () => {
			GlobalRegistrator.register();

			const included: string[] = [];
			const propertyNames = Object.getOwnPropertyNames(global);

			for (const name of GETTERS) {
				if (propertyNames.includes(name)) {
					included.push(name);
				}
			}

			assert.strictEqual(included.length, GETTERS.length);

			GlobalRegistrator.unregister();
		});

		it('Defines self referring properties', async () => {
			GlobalRegistrator.register();

			for (const property of SELF_REFERRING_PROPERTIES) {
				assert.strictEqual((<any>global)[property], global);
			}

			GlobalRegistrator.unregister();
		});

		it('Has the properties "customElements" applied to the global object', () => {
			GlobalRegistrator.register();

			assert.strictEqual(
				globalThis.customElements instanceof globalThis.CustomElementRegistry,
				true
			);

			GlobalRegistrator.unregister();
		});

		it('Can set the location.href property', () => {
			GlobalRegistrator.register();
			globalThis.location.href = 'https://example.com/';
			assert.strictEqual(globalThis.location.href, 'https://example.com/');
			GlobalRegistrator.unregister();
		});

		it('Supports CSS', () => {
			GlobalRegistrator.register();
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

			assert.strictEqual(globalThis.getComputedStyle(document.body).backgroundColor, 'green');

			GlobalRegistrator.unregister();
		});

		it('Supports options for registering', () => {
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

			assert.strictEqual(globalThis.location.href, 'https://example.com/');
			assert.strictEqual(globalThis.innerWidth, 1920);
			assert.strictEqual(globalThis.innerHeight, 1080);
			assert.strictEqual(globalThis.navigator.userAgent, 'Custom User Agent');

			GlobalRegistrator.unregister();
		});

		it('Overrides global properties with throwing getters (Node 26+ localStorage scenario)', () => {
			// Simulate Node 26+ behavior where localStorage throws SecurityError without --localstorage-file
			// This was briefly in Node 25.2.0, reverted in 25.2.1, and planned for Node 26.0.0
			// See: https://nodejs.org/en/blog/release/v25.2.1
			const originalDescriptor = Object.getOwnPropertyDescriptor(
				globalThis,
				'testThrowingProperty'
			);

			Object.defineProperty(globalThis, 'testThrowingProperty', {
				get: () => {
					throw new Error('SecurityError: Cannot access without configuration');
				},
				configurable: true
			});

			try {
				GlobalRegistrator.register();

				// Verify localStorage works (happy-dom's implementation should override any throwing native)
				assert.strictEqual(typeof globalThis.localStorage.getItem, 'function');
				assert.strictEqual(globalThis.localStorage.getItem('nonexistent'), null);

				// Test setItem/getItem roundtrip
				globalThis.localStorage.setItem('testKey', 'testValue');
				assert.strictEqual(globalThis.localStorage.getItem('testKey'), 'testValue');

				GlobalRegistrator.unregister();
			} finally {
				// Clean up the test property
				if (originalDescriptor) {
					Object.defineProperty(globalThis, 'testThrowingProperty', originalDescriptor);
				} else {
					delete (<any>globalThis).testThrowingProperty;
				}
			}
		});
	});

	describe('unregister()', () => {
		it('Restores properties and getters after unregistering', () => {
			GlobalRegistrator.register();
			GlobalRegistrator.unregister();

			const included: string[] = [];
			const propertyNames = Object.getOwnPropertyNames(global);

			for (const name of GETTERS) {
				if (propertyNames.includes(name)) {
					included.push(name);
				}
			}

			// Different Node versions have different native globals:
			// - Node 21+: navigator
			// - Node 25+: localStorage, sessionStorage (as non-functional stubs)
			// We verify that happy-dom properties were cleaned up and only native ones remain.
			const nativeProperties = ['navigator', 'localStorage', 'sessionStorage'];
			const nonNativeRemaining = included.filter((name) => !nativeProperties.includes(name));

			assert.strictEqual(
				nonNativeRemaining.length,
				0,
				`Non-native properties should be removed after unregister, but found: ${nonNativeRemaining.join(', ')}`
			);
		});

		it('Restores setTimeout after unregistering', () => {
			GlobalRegistrator.register();
			GlobalRegistrator.unregister();
			assert.strictEqual(global.setTimeout, ORIGINAL_SET_TIMEOUT);
		});
	});

	describe('get isRegistered()', () => {
		it('Has isRegistered property', () => {
			assert.strictEqual(GlobalRegistrator.isRegistered, false);
			GlobalRegistrator.register();
			assert.strictEqual(GlobalRegistrator.isRegistered, true);
			GlobalRegistrator.unregister();
			assert.strictEqual(GlobalRegistrator.isRegistered, false);
		});
	});
});
