import AsyncWindow from '../../src/window/AsyncWindow';

describe('AsyncWindow', () => {
	let window;

	beforeEach(() => {
		window = new AsyncWindow();
	});

	afterEach(() => {
		jest.restoreAllMocks();
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
			const expectedUrl = '/url/';
			const expectedOptions = {};
			const expectedJsonResponse = {};
			jest.spyOn(window, 'fetch').mockImplementation((url, options) => {
				expect(url).toBe(expectedUrl);
				expect(options).toBe(expectedOptions);
				return Promise.resolve({
					json: () => Promise.resolve(expectedJsonResponse)
				});
			});
			const response = await window.fetch(expectedUrl, expectedOptions);
			const jsonResponse = await response.json();
			expect(jsonResponse).toBe(expectedJsonResponse);
		});

		test('Handles successful Text request.', async () => {
			const expectedUrl = '/url/';
			const expectedOptions = {};
			const expectedTextResponse = 'response';
			jest.spyOn(window, 'fetch').mockImplementation((url, options) => {
				expect(url).toBe(expectedUrl);
				expect(options).toBe(expectedOptions);
				return Promise.resolve({
					text: () => Promise.resolve(expectedTextResponse)
				});
			});
			const response = await window.fetch(expectedUrl, expectedOptions);
			const textResponse = await response.text();
			expect(textResponse).toBe(expectedTextResponse);
		});

		test('Handles error JSON request.', async () => {
			const expectedUrl = '/url/';
			const expectedOptions = {};
			const expectedError = new Error('error');
			jest.spyOn(window, 'fetch').mockImplementation((url, options) => {
				expect(url).toBe(expectedUrl);
				expect(options).toBe(expectedOptions);
				return Promise.reject(expectedError);
			});
			try {
				await window.fetch(expectedUrl, expectedOptions);
			} catch (error) {
				expect(error).toBe(expectedError);
			}
		});
	});

	describe('whenAsyncComplete()', () => {
		test('Resolves the Promise returned by whenAsyncComplete() when all async tasks has been completed.', async () => {
			jest.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve({
					json: () => Promise.resolve({}),
					text: () => Promise.resolve({})
				});
			});

			let isFirstWhenAsyncCompleteCalled = false;
			window.whenAsyncComplete().then(() => {
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
			await window.whenAsyncComplete();
			expect(tasksDone).toBe(6);
			expect(isFirstWhenAsyncCompleteCalled).toBe(true);
		});
	});

	describe('cancelAsync()', () => {
		test('Cancels all ongoing asynchrounous tasks.', done => {
			jest.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve({
					json: () => Promise.resolve({}),
					text: () => Promise.resolve({})
				});
			});

			let isFirstWhenAsyncCompleteCalled = false;
			window.whenAsyncComplete().then(() => {
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

			let isSecondWhenAsyncCompleteCalled = false;
			window.whenAsyncComplete().then(() => {
				isSecondWhenAsyncCompleteCalled = true;
			});

			window.cancelAsync();

			expect(tasksDone).toBe(0);

			global.setTimeout(() => {
				expect(isFirstWhenAsyncCompleteCalled).toBe(true);
				expect(isSecondWhenAsyncCompleteCalled).toBe(true);
				done();
			}, 1);
		});
	});
});
