import Window from '../../src/window/Window.js';
import IWindow from '../../src/window/IWindow.js';
import HTTP from 'http';
import Stream from 'stream';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import DetachedWindowAPI from '../../src/window/DetachedWindowAPI.js';
import VirtualConsolePrinter from '../../src/console/VirtualConsolePrinter.js';
import DefaultBrowserSettings from '../../src/browser/DefaultBrowserSettings.js';

describe('DetachedWindowAPI', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get settings()', () => {
		it('Returns browser settings.', () => {
			const window = new Window({ settings: { disableJavaScriptEvaluation: true } });
			expect(window.happyDOM?.settings).toEqual({
				...DefaultBrowserSettings,
				disableJavaScriptEvaluation: true
			});
		});

		it('Supports editing setting properties.', () => {
			const window = new Window({ settings: { disableJavaScriptEvaluation: true } });
			(<DetachedWindowAPI>window.happyDOM).settings.disableJavaScriptEvaluation = false;
			expect(window.happyDOM?.settings).toEqual(DefaultBrowserSettings);
		});
	});

	describe('get virtualConsolePrinter()', () => {
		it('Returns an instance of VirtualConsolePrinter.', () => {
			window.console.log('Test 1', { key1: 'value1' });
			window.console.info('Test 2', { key2: 'value2' });

			expect(window.happyDOM?.virtualConsolePrinter).toBeInstanceOf(VirtualConsolePrinter);
			expect(window.happyDOM?.virtualConsolePrinter.readAsString()).toBe(
				`Test 1 {"key1":"value1"}\nTest 2 {"key2":"value2"}\n`
			);
		});
	});

	describe('whenComplete()', () => {
		it('Resolves the Promise when all async tasks has been completed.', async () => {
			const responseText = '{ "test": "test" }';
			mockModule('https', {
				request: () => {
					return {
						end: () => {},
						on: (event: string, callback: (response: HTTP.IncomingMessage) => void) => {
							if (event === 'response') {
								async function* generate(): AsyncGenerator<string> {
									yield responseText;
								}

								const response = <HTTP.IncomingMessage>Stream.Readable.from(generate());

								response.statusCode = 200;
								response.statusMessage = '';
								response.headers = {
									'content-length': '0'
								};
								response.rawHeaders = ['content-length', '0'];

								setTimeout(() => callback(response));
							}
						},
						setTimeout: () => {}
					};
				}
			});

			window.location.href = 'https://localhost:8080';
			let isFirstWhenAsyncCompleteCalled = false;
			window.happyDOM?.whenComplete().then(() => {
				isFirstWhenAsyncCompleteCalled = true;
			});
			let tasksDone = 0;
			const intervalID = window.setInterval(() => {
				tasksDone++;
			});
			window.clearInterval(intervalID);
			window.setTimeout(() => {
				tasksDone++;
			});
			window.setTimeout(() => {
				tasksDone++;
			});
			window.requestAnimationFrame(() => {
				tasksDone++;
			});
			window.requestAnimationFrame(() => {
				tasksDone++;
			});
			window.fetch('/url/1/').then((response) => {
				response.json().then(() => {
					tasksDone++;
				});
			});
			window.fetch('/url/2/').then((response) => {
				response.text().then(() => {
					tasksDone++;
				});
			});
			await window.happyDOM?.whenComplete();
			expect(tasksDone).toBe(6);
			expect(isFirstWhenAsyncCompleteCalled).toBe(true);
		});
	});

	describe('whenAsyncComplete()', () => {
		it('Calls whenComplete().', async () => {
			let isCalled = false;
			vi.spyOn(<DetachedWindowAPI>window.happyDOM, 'whenComplete').mockImplementation(() => {
				isCalled = true;
				return Promise.resolve();
			});
			await window.happyDOM?.whenComplete();
			expect(isCalled).toBe(true);
		});
	});

	describe('abort()', () => {
		it('Cancels all ongoing asynchrounous tasks.', async () => {
			await new Promise((resolve) => {
				window.location.href = 'https://localhost:8080';
				let isFirstWhenAsyncCompleteCalled = false;
				window.happyDOM?.whenComplete().then(() => {
					isFirstWhenAsyncCompleteCalled = true;
				});
				let tasksDone = 0;
				const intervalID = window.setInterval(() => {
					tasksDone++;
				});
				window.clearInterval(intervalID);
				window.setTimeout(() => {
					tasksDone++;
				});
				window.setTimeout(() => {
					tasksDone++;
				});
				window.requestAnimationFrame(() => {
					tasksDone++;
				});
				window.requestAnimationFrame(() => {
					tasksDone++;
				});

				window
					.fetch('/url/')
					.then((response) =>
						response
							.json()
							.then(() => {
								tasksDone++;
							})
							.catch(() => {})
					)
					.catch(() => {});

				window
					.fetch('/url/')
					.then((response) =>
						response
							.json()
							.then(() => {
								tasksDone++;
							})
							.catch(() => {})
					)
					.catch(() => {});

				let isSecondWhenAsyncCompleteCalled = false;
				window.happyDOM?.whenComplete().then(() => {
					isSecondWhenAsyncCompleteCalled = true;
				});

				window.happyDOM?.abort();

				expect(tasksDone).toBe(0);

				window.setTimeout(() => {
					expect(isFirstWhenAsyncCompleteCalled).toBe(true);
					expect(isSecondWhenAsyncCompleteCalled).toBe(true);
					resolve(null);
				}, 1);
			});
		});
	});

	describe('cancelAsync', () => {
		it('Calls abort().', () => {
			let isCalled = false;
			vi.spyOn(<DetachedWindowAPI>window.happyDOM, 'abort').mockImplementation(() => {
				isCalled = true;
			});
			window.happyDOM?.abort();
			expect(isCalled).toBe(true);
		});
	});

	describe('setURL()', () => {
		it('Sets URL.', () => {
			window.happyDOM?.setURL('https://localhost:8080');
			expect(window.location.href).toBe('https://localhost:8080/');
		});
	});

	describe('setViewport()', () => {
		it('Sets the viewport width.', () => {
			window.happyDOM?.setViewport({ width: 100 });
			expect(window.innerWidth).toBe(100);
			expect(window.outerWidth).toBe(100);
		});

		it('Sets the viewport height.', () => {
			window.happyDOM?.setViewport({ height: 100 });
			expect(window.innerHeight).toBe(100);
			expect(window.outerHeight).toBe(100);
		});

		it('Sets the viewport width and height.', () => {
			window.happyDOM?.setViewport({ width: 100, height: 100 });
			expect(window.innerWidth).toBe(100);
			expect(window.outerWidth).toBe(100);
			expect(window.innerHeight).toBe(100);
			expect(window.outerHeight).toBe(100);
		});

		it('Sets the viewport device scale factor.', () => {
			window.happyDOM?.setViewport({ deviceScaleFactor: 2 });
			expect(window.devicePixelRatio).toBe(2);
		});
	});

	describe('setWindowSize()', () => {
		it('Sets window width.', () => {
			window.happyDOM?.setWindowSize({ width: 1920 });
			expect(window.innerWidth).toBe(1920);
			expect(window.outerWidth).toBe(1920);
		});

		it('Sets window height.', () => {
			window.happyDOM?.setWindowSize({ height: 1080 });
			expect(window.innerHeight).toBe(1080);
			expect(window.outerHeight).toBe(1080);
		});

		it('Sets window width and height.', () => {
			window.happyDOM?.setWindowSize({ width: 1920, height: 1080 });
			expect(window.innerWidth).toBe(1920);
			expect(window.innerHeight).toBe(1080);
			expect(window.outerWidth).toBe(1920);
			expect(window.outerHeight).toBe(1080);
		});
	});

	describe('setInnerWidth()', () => {
		it('Sets window width.', () => {
			window.happyDOM?.setInnerWidth(1920);
			expect(window.innerWidth).toBe(1920);
			expect(window.outerWidth).toBe(1920);
		});
	});

	describe('setInnerHeight()', () => {
		it('Sets window height.', () => {
			window.happyDOM?.setInnerHeight(1080);
			expect(window.innerHeight).toBe(1080);
			expect(window.outerHeight).toBe(1080);
		});
	});
});
