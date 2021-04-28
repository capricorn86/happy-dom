import { HTMLElement } from '../../src';
import CSSStyleDeclaration from '../../src/css/CSSStyleDeclaration';
import IFetchOptions from '../../src/window/IFetchOptions';
import IResponse from '../../src/window/IResponse';
import Window from '../../src/window/Window';

describe('Window', () => {
	let window: Window;
	let fetchedUrl: string;
	let fetchedOptions: IFetchOptions;
	let fetchResponseBody: string;
	let fetchError: Error;

	beforeAll(() => {
		jest.mock('node-fetch', () => (url: string, options: IFetchOptions) => {
			fetchedUrl = url;
			fetchedOptions = options;
			if (fetchError) {
				return Promise.reject(fetchError);
			}
			return <Promise<IResponse>>Promise.resolve({
				text: () => Promise.resolve(fetchResponseBody),
				json: () => Promise.resolve(JSON.parse(fetchResponseBody)),
				blob: () => Promise.resolve(null),
				formData: () => Promise.resolve(null)
			});
		});
	});

	beforeEach(() => {
		fetchedUrl = null;
		fetchedOptions = null;
		fetchResponseBody = null;
		fetchError = null;
		window = new Window();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('getComputedStyle()', () => {
		test('Returns a CSSStyleDeclaration object with computed styles that are live updated whenever the element styles are changed.', () => {
			const element = <HTMLElement>window.document.createElement('div');
			const computedStyle = window.getComputedStyle(element);

			element.style.direction = 'rtl';

			expect(computedStyle instanceof CSSStyleDeclaration).toBe(true);

			expect(computedStyle.direction).toBe('');

			window.document.body.appendChild(element);

			expect(computedStyle.direction).toBe('rtl');
		});
	});

	describe('setTimeout()', () => {
		test('Sets a timeout.', done => {
			const timeoutId = window.setTimeout(() => done());
			expect(timeoutId.constructor.name).toBe('Timeout');
		});
	});

	describe('clearTimeout()', () => {
		test('Clears a timeout.', () => {
			const timeoutId = window.setTimeout(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.clearTimeout(timeoutId);
		});
	});

	describe('setInterval()', () => {
		test('Sets an interval.', done => {
			let count = 0;
			const intervalId = window.setInterval(() => {
				count++;
				if (count > 2) {
					clearInterval(intervalId);
					done();
				}
			});
		});
	});

	describe('clearInterval()', () => {
		test('Clears an interval.', () => {
			const intervalId = window.setInterval(() => {
				throw new Error('This interval should have been canceled.');
			});
			window.clearInterval(intervalId);
		});
	});

	describe('requestAnimationFrame()', () => {
		test('Requests an animation frame.', done => {
			const timeoutId = window.requestAnimationFrame(() => done());
			expect(timeoutId.constructor.name).toBe('Timeout');
		});
	});

	describe('cancelAnimationFrame()', () => {
		test('Cancels an animation frame.', () => {
			const timeoutId = window.requestAnimationFrame(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.cancelAnimationFrame(timeoutId);
		});
	});

	describe('fetch()', () => {
		test('Handles successful JSON request.', async () => {
			const expectedUrl = 'https://localhost:8080/path/';
			const expectedOptions = {};

			fetchResponseBody = '{}';

			const response = await window.fetch(expectedUrl, expectedOptions);
			const jsonResponse = await response.json();

			expect(fetchedUrl).toBe(expectedUrl);
			expect(fetchedOptions).toBe(expectedOptions);
			expect(jsonResponse).toEqual({});
		});

		test('Handles successful Text request.', async () => {
			const expectedUrl = 'https://localhost:8080/path/';
			const expectedOptions = {};

			fetchResponseBody = 'text';

			const response = await window.fetch(expectedUrl, expectedOptions);
			const textResponse = await response.text();

			expect(fetchedUrl).toBe(expectedUrl);
			expect(fetchedOptions).toBe(expectedOptions);
			expect(textResponse).toEqual(fetchResponseBody);
		});

		test('Handles relative URL.', async () => {
			const expectedPath = '/path/';
			const expectedOptions = {};

			window.location.href = 'https://localhost:8080';

			fetchResponseBody = 'text';

			const response = await window.fetch(expectedPath, expectedOptions);
			const textResponse = await response.text();

			expect(fetchedUrl).toBe('https://localhost:8080' + expectedPath);
			expect(fetchedOptions).toBe(expectedOptions);
			expect(textResponse).toEqual(fetchResponseBody);
		});

		test('Handles error JSON request.', async () => {
			fetchError = new Error('error');

			try {
				await window.fetch('/url/', {});
			} catch (error) {
				expect(error).toBe(fetchError);
			}
		});
	});

	describe('happyDOM.whenAsyncComplete()', () => {
		test('Resolves the Promise returned by whenAsyncComplete() when all async tasks has been completed.', async () => {
			let isFirstWhenAsyncCompleteCalled = false;
			window.happyDOM.whenAsyncComplete().then(() => {
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
			window.fetch('/url/').then(response =>
				response.json().then(() => {
					tasksDone++;
				})
			);
			window.fetch('/url/').then(response =>
				response.text().then(() => {
					tasksDone++;
				})
			);
			await window.happyDOM.whenAsyncComplete();
			expect(tasksDone).toBe(6);
			expect(isFirstWhenAsyncCompleteCalled).toBe(true);
		});
	});

	describe('happyDOM.cancelAsync()', () => {
		test('Cancels all ongoing asynchrounous tasks.', done => {
			let isFirstWhenAsyncCompleteCalled = false;
			window.happyDOM.whenAsyncComplete().then(() => {
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
				.then(response =>
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
				.then(response =>
					response
						.json()
						.then(() => {
							tasksDone++;
						})
						.catch(() => {})
				)
				.catch(() => {});

			let isSecondWhenAsyncCompleteCalled = false;
			window.happyDOM.whenAsyncComplete().then(() => {
				isSecondWhenAsyncCompleteCalled = true;
			});

			window.happyDOM.cancelAsync();

			expect(tasksDone).toBe(0);

			global.setTimeout(() => {
				expect(isFirstWhenAsyncCompleteCalled).toBe(true);
				expect(isSecondWhenAsyncCompleteCalled).toBe(true);
				done();
			}, 1);
		});
	});

	for (const functionName of ['scroll', 'scrollTo']) {
		describe(`${functionName}()`, () => {
			test('Sets the properties scrollTop and scrollLeft.', () => {
				window[functionName](50, 60);
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
			});

			test('Sets the properties scrollTop and scrollLeft using object.', () => {
				window[functionName]({ left: 50, top: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
			});

			test('Sets only the property scrollTop.', () => {
				window[functionName]({ top: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(0);
				expect(window.document.documentElement.scrollTop).toBe(60);
			});

			test('Sets only the property scrollLeft.', () => {
				window[functionName]({ left: 60 });
				expect(window.document.documentElement.scrollLeft).toBe(60);
				expect(window.document.documentElement.scrollTop).toBe(0);
			});

			test('Sets the properties scrollTop and scrollLeft with animation.', async () => {
				window[functionName]({ left: 50, top: 60, behavior: 'smooth' });
				expect(window.document.documentElement.scrollLeft).toBe(0);
				expect(window.document.documentElement.scrollTop).toBe(0);
				await window.happyDOM.whenAsyncComplete();
				expect(window.document.documentElement.scrollLeft).toBe(50);
				expect(window.document.documentElement.scrollTop).toBe(60);
			});
		});
	}
});
