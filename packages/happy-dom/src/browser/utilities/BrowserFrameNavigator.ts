import IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IGoToOptions from '../types/IGoToOptions.js';
import Response from '../../fetch/Response.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import BrowserFrameFactory from './BrowserFrameFactory.js';
import BrowserFrameURL from './BrowserFrameURL.js';
import BrowserFrameValidator from './BrowserFrameValidator.js';
import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import FormData from '../../form-data/FormData.js';
import HistoryScrollRestorationEnum from '../../history/HistoryScrollRestorationEnum.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import Fetch from '../../fetch/Fetch.js';

/**
 * Browser frame navigation utility.
 */
export default class BrowserFrameNavigator {
	/**
	 * Navigates to a page.
	 *
	 * @throws Error if the request can't be resolved (because of SSL error or similar). It will not throw if the response is not ok.
	 * @param options Options.
	 * @param options.windowClass Window class.
	 * @param options.frame Frame.
	 * @param options.url URL.
	 * @param [options.goToOptions] Go to options.
	 * @param [options.method] Method.
	 * @param [options.formData] Form data.
	 * @param [options.disableHistory] Disables adding the navigation to the history.
	 * @returns Response.
	 */
	public static async navigate(options: {
		windowClass: new (
			browserFrame: IBrowserFrame,
			options?: { url?: string; width?: number; height?: number }
		) => BrowserWindow;
		frame: IBrowserFrame;
		url: string;
		goToOptions?: IGoToOptions;
		method?: string;
		formData?: FormData | null;
		disableHistory?: boolean;
	}): Promise<Response | null> {
		const { windowClass, frame, url, formData, method, goToOptions, disableHistory } = options;
		const exceptionObserver = frame.page.context.browser[PropertySymbol.exceptionObserver];
		const referrer = goToOptions?.referrer || frame.window.location.origin;
		const targetURL = BrowserFrameURL.getRelativeURL(frame, url);
		const targetURLWithoutHash = new URL(targetURL.href.split('#')[0]);
		const currentURLWithoutHash = new URL(frame.url.split('#')[0]);
		const resolveNavigationListeners = (): void => {
			const listeners = frame[PropertySymbol.listeners].navigation;
			frame[PropertySymbol.listeners].navigation = [];
			for (const listener of listeners) {
				listener();
			}
		};

		if (!frame.window) {
			throw new Error('The frame has been destroyed, the "window" property is not set.');
		}

		// Hash navigation
		if (
			targetURLWithoutHash.href === currentURLWithoutHash.href &&
			targetURL.hash &&
			targetURL.hash !== frame.window?.location.hash
		) {
			const history = frame[PropertySymbol.history];

			if (!disableHistory) {
				history.currentItem.popState = true;

				history.push({
					title: '',
					href: targetURL.href,
					state: null,
					popState: true,
					scrollRestoration: HistoryScrollRestorationEnum.manual,
					method: method || (formData ? 'POST' : 'GET'),
					formData: formData || null
				});
			}

			frame.window.location[PropertySymbol.setURL](frame, targetURL.href);

			return null;
		}

		// Javascript protocol
		if (targetURL.protocol === 'javascript:') {
			if (frame && frame.page.context.browser.settings.enableJavaScriptEvaluation) {
				const readyStateManager = frame.window[PropertySymbol.readyStateManager];
				const asyncTaskManager = frame[PropertySymbol.asyncTaskManager];

				const taskID = readyStateManager.startTask();
				const code = targetURL.href.replace('javascript:', '');

				// The browser will wait for the next tick before executing the script.
				// Fixes issue where evaluating the response can throw an error.
				// By using requestAnimationFrame() the error will not reject the promise.
				// The error will be caught by process error level listener or a try and catch in the requestAnimationFrame().
				await new Promise((resolve) => {
					frame.window.requestAnimationFrame(() => {
						const immediate = setImmediate(() => {
							asyncTaskManager.endTask(taskID);
							resolve(null);
						});
						const taskID = asyncTaskManager.startTask(() => () => {
							clearImmediate(immediate);
							resolve(null);
						});
						frame.window[PropertySymbol.evaluateScript](code, { filename: frame.url });
					});
				});

				readyStateManager.endTask(taskID);
				resolveNavigationListeners();
			}

			return null;
		}

		// Validate navigation
		if (!BrowserFrameValidator.validateCrossOriginPolicy(frame, targetURL)) {
			return null;
		}

		if (!BrowserFrameValidator.validateFrameNavigation(frame)) {
			if (!frame.page.context.browser.settings.navigation.disableFallbackToSetURL) {
				frame.window.location[PropertySymbol.setURL](frame, targetURL.href);
			}

			return null;
		}

		// History management.
		if (!disableHistory) {
			const history = frame[PropertySymbol.history];

			history.push({
				title: '',
				href: targetURL.href,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: method || (formData ? 'POST' : 'GET'),
				formData: formData || null
			});
		}

		// Store current Window state
		const previousWindow = frame.window;
		const previousAsyncTaskManager = frame[PropertySymbol.asyncTaskManager];
		const width = previousWindow.innerWidth;
		const height = previousWindow.innerHeight;
		const devicePixelRatio = previousWindow.devicePixelRatio;
		const parentWindow = frame.parentFrame ? frame.parentFrame.window : frame.page.mainFrame.window;
		const topWindow = frame.page.mainFrame.window;

		// Create new Window
		frame[PropertySymbol.asyncTaskManager] = new AsyncTaskManager(frame);
		(<BrowserWindow>frame.window) = new windowClass(frame, { url: targetURL.href, width, height });
		frame.window[PropertySymbol.parent] = parentWindow;
		frame.window[PropertySymbol.top] = topWindow;
		(<number>frame.window.devicePixelRatio) = devicePixelRatio;

		if (exceptionObserver) {
			exceptionObserver.observe(frame.window);
		}

		if (referrer) {
			frame.window.document[PropertySymbol.referrer] = referrer;
		}

		// Destroy child frames and Window
		const destroyTaskID = frame[PropertySymbol.asyncTaskManager].startTask();
		const destroyWindowAndAsyncTaskManager = (): void => {
			previousAsyncTaskManager.destroy().then(() => {
				if (exceptionObserver) {
					exceptionObserver.disconnect(previousWindow);
				}
				frame[PropertySymbol.asyncTaskManager].endTask(destroyTaskID);
			});

			previousWindow[PropertySymbol.destroy]();
		};

		if (frame.childFrames.length) {
			Promise.all(
				frame.childFrames.map((childFrame) => BrowserFrameFactory.destroyFrame(childFrame))
			).then(destroyWindowAndAsyncTaskManager);
		} else {
			destroyWindowAndAsyncTaskManager();
		}

		// About protocol
		if (targetURL.protocol === 'about:') {
			if (goToOptions?.beforeContentCallback) {
				goToOptions.beforeContentCallback(frame.window);
			}
			if (frame.page.context.browser.settings.navigation.beforeContentCallback) {
				frame.page.context.browser.settings.navigation.beforeContentCallback(frame.window);
			}
			await new Promise((resolve) => frame.page.mainFrame.window.requestAnimationFrame(resolve));
			resolveNavigationListeners();
			return null;
		}

		// Start navigation
		const readyStateManager = frame.window[PropertySymbol.readyStateManager];
		const asyncTaskManager = frame[PropertySymbol.asyncTaskManager];
		const abortController = new frame.window.AbortController();
		const timeout = setTimeout(() => {
			asyncTaskManager.endTimer(timeout);
			abortController.abort(
				new frame.window.DOMException(
					'The operation was aborted. Request timed out.',
					DOMExceptionNameEnum.timeoutError
				)
			);
		}, goToOptions?.timeout ?? 30000);
		asyncTaskManager.startTimer(timeout);

		const taskID = readyStateManager.startTask();
		const finalize = (): void => {
			clearTimeout(timeout);
			asyncTaskManager.endTimer(timeout);
			readyStateManager.endTask(taskID);
			resolveNavigationListeners();
		};
		const headers = new frame.window.Headers(goToOptions?.headers);
		let response: Response;
		let responseText: string;

		if (goToOptions?.hard) {
			headers.set('Cache-Control', 'no-cache');
		}

		const fetch = new Fetch({
			browserFrame: frame,
			window: frame.window,
			url: targetURL.href,
			disableSameOriginPolicy: true,
			init: {
				referrer,
				referrerPolicy: goToOptions?.referrerPolicy || 'origin',
				signal: abortController.signal,
				method: method || (formData ? 'POST' : 'GET'),
				headers,
				body: formData
			}
		});

		try {
			response = await fetch.send();

			// Handles the "X-Frame-Options" header for child frames.
			if (frame.parentFrame) {
				const originURL = frame.parentFrame.window.location;
				const xFrameOptions = response.headers?.get('X-Frame-Options')?.toLowerCase();
				const isSameOrigin = originURL.origin === targetURL.origin || targetURL.origin === 'null';

				if (xFrameOptions === 'deny' || (xFrameOptions === 'sameorigin' && !isSameOrigin)) {
					throw new Error(
						`Refused to display '${url}' in a frame because it set 'X-Frame-Options' to '${xFrameOptions}'.`
					);
				}
			}

			responseText = await response.text();
		} catch (error) {
			finalize();
			throw error;
		}

		// The frame may be destroyed during teardown.
		if (!frame.window) {
			return null;
		}

		if (response.url) {
			frame.window[PropertySymbol.location][PropertySymbol.setURL](frame, response.url);
		}

		if (!response.ok) {
			frame.page.console.error(`GET ${targetURL.href} ${response.status} (${response.statusText})`);
		}

		if (goToOptions?.beforeContentCallback) {
			goToOptions.beforeContentCallback(frame.window);
		}

		if (frame.page.context.browser.settings.navigation.beforeContentCallback) {
			frame.page.context.browser.settings.navigation.beforeContentCallback(frame.window);
		}

		// Fixes issue where evaluating the response can throw an error.
		// By using requestAnimationFrame() the error will not reject the promise.
		// The error will be caught by process error level listener or a try and catch in the requestAnimationFrame().
		await new Promise((resolve) => {
			frame.window.requestAnimationFrame(() => {
				// "immediate" needs to be assigned before initialization in Node v20
				// eslint-disable-next-line prefer-const
				let immediate: NodeJS.Immediate;
				const taskID = asyncTaskManager.startTask(() => () => {
					clearImmediate(immediate);
					resolve(null);
				});
				immediate = setImmediate(() => {
					asyncTaskManager.endTask(taskID);
					resolve(null);
				});
				frame.content = responseText;
			});
		});

		finalize();

		return response;
	}

	/**
	 * Navigates back in history.
	 *
	 * @param options Options.
	 * @param options.windowClass Window class.
	 * @param options.frame Frame.
	 * @param [options.goToOptions] Go to options.
	 */
	public static navigateBack(options: {
		windowClass: new (
			browserFrame: IBrowserFrame,
			options?: { url?: string; width?: number; height?: number }
		) => BrowserWindow;
		frame: IBrowserFrame;
		goToOptions?: IGoToOptions;
	}): Promise<Response | null> {
		const { windowClass, frame, goToOptions } = options;
		const history = frame[PropertySymbol.history];
		const historyItem = history.items[history.items.indexOf(history.currentItem) - 1];

		if (!historyItem) {
			return new Promise((resolve) => {
				frame.window.requestAnimationFrame(() => {
					const listeners = frame[PropertySymbol.listeners].navigation;
					frame[PropertySymbol.listeners].navigation = [];
					for (const listener of listeners) {
						listener();
					}
					resolve(null);
				});
			});
		}

		const fromOrigin = new URL(history.currentItem.href).origin;
		const toOrigin = new URL(historyItem.href).origin;

		history.currentItem = historyItem;

		if (!historyItem.popState || fromOrigin !== toOrigin) {
			return BrowserFrameNavigator.navigate({
				windowClass,
				frame,
				goToOptions: {
					...goToOptions,
					referrer: frame.url
				},
				url: historyItem.href,
				method: historyItem.method,
				formData: historyItem.formData,
				disableHistory: true
			});
		}

		frame.window.location[PropertySymbol.setURL](frame, historyItem.href);

		frame.window.dispatchEvent(
			new frame.window.PopStateEvent('popstate', {
				state: historyItem.state,
				hasUAVisualTransition: false
			})
		);

		return Promise.resolve(null);
	}

	/**
	 * Navigates forward in history.
	 *
	 * @param options Options.
	 * @param options.windowClass Window class.
	 * @param options.frame Frame.
	 * @param [options.goToOptions] Go to options.
	 */
	public static navigateForward(options: {
		windowClass: new (
			browserFrame: IBrowserFrame,
			options?: { url?: string; width?: number; height?: number }
		) => BrowserWindow;
		frame: IBrowserFrame;
		goToOptions?: IGoToOptions;
	}): Promise<Response | null> {
		const { windowClass, frame, goToOptions } = options;
		const history = frame[PropertySymbol.history];
		const historyItem = history.items[history.items.indexOf(history.currentItem) + 1];

		if (!historyItem) {
			return new Promise((resolve) => {
				frame.window.requestAnimationFrame(() => {
					const listeners = frame[PropertySymbol.listeners].navigation;
					frame[PropertySymbol.listeners].navigation = [];
					for (const listener of listeners) {
						listener();
					}
					resolve(null);
				});
			});
		}

		const fromOrigin = new URL(history.currentItem.href).origin;
		const toOrigin = new URL(historyItem.href).origin;

		history.currentItem = historyItem;

		if (!historyItem.popState || fromOrigin !== toOrigin) {
			return BrowserFrameNavigator.navigate({
				windowClass,
				frame,
				goToOptions: {
					...goToOptions,
					referrer: frame.url
				},
				url: historyItem.href,
				method: historyItem.method,
				formData: historyItem.formData,
				disableHistory: true
			});
		}

		frame.window.location[PropertySymbol.setURL](frame, historyItem.href);

		frame.window.dispatchEvent(
			new frame.window.PopStateEvent('popstate', {
				state: historyItem.state,
				hasUAVisualTransition: false
			})
		);

		return Promise.resolve(null);
	}

	/**
	 * Navigates steps in history.
	 *
	 * @param options Options.
	 * @param options.windowClass Window class.
	 * @param options.frame Frame.
	 * @param options.goToOptions Go to options.
	 * @param options.steps Steps.
	 */
	public static navigateSteps(options: {
		windowClass: new (
			browserFrame: IBrowserFrame,
			options?: { url?: string; width?: number; height?: number }
		) => BrowserWindow;
		frame: IBrowserFrame;
		goToOptions?: IGoToOptions;
		steps?: number;
	}): Promise<Response | null> {
		if (!options.steps) {
			return this.reload(options);
		}

		const { windowClass, frame, goToOptions, steps } = options;
		const history = frame[PropertySymbol.history];
		const fromIndex = history.items.indexOf(history.currentItem);
		const toIndex = fromIndex + steps;
		const historyItem = history.items[toIndex];

		if (!historyItem) {
			return new Promise((resolve) => {
				frame.window.requestAnimationFrame(() => {
					const listeners = frame[PropertySymbol.listeners].navigation;
					frame[PropertySymbol.listeners].navigation = [];
					for (const listener of listeners) {
						listener();
					}
					resolve(null);
				});
			});
		}

		const fromOrigin = new URL(history.currentItem.href).origin;
		let isPopState = true;

		if (steps < 0) {
			for (let i = fromIndex; i > toIndex; i--) {
				if (!history.items[i].popState || fromOrigin !== new URL(history.items[i].href).origin) {
					isPopState = false;
					break;
				}
			}
		} else {
			for (let i = fromIndex; i < toIndex; i++) {
				if (!history.items[i].popState || fromOrigin !== new URL(history.items[i].href).origin) {
					isPopState = false;
					break;
				}
			}
		}

		history.currentItem = historyItem;

		if (!isPopState) {
			return BrowserFrameNavigator.navigate({
				windowClass,
				frame,
				goToOptions: {
					...goToOptions,
					referrer: frame.url
				},
				url: historyItem.href,
				method: historyItem.method,
				formData: historyItem.formData,
				disableHistory: true
			});
		}

		frame.window.location[PropertySymbol.setURL](frame, historyItem.href);

		frame.window.dispatchEvent(
			new frame.window.PopStateEvent('popstate', {
				state: historyItem.state,
				hasUAVisualTransition: false
			})
		);

		return Promise.resolve(null);
	}

	/**
	 * Reloads the current history item.
	 *
	 * @param options Options.
	 * @param options.windowClass Window class.
	 * @param options.frame Frame.
	 * @param options.goToOptions Go to options.
	 */
	public static reload(options: {
		windowClass: new (
			browserFrame: IBrowserFrame,
			options?: { url?: string; width?: number; height?: number }
		) => BrowserWindow;
		frame: IBrowserFrame;
		goToOptions?: IGoToOptions;
	}): Promise<Response | null> {
		const { windowClass, frame, goToOptions } = options;
		const history = frame[PropertySymbol.history];

		return BrowserFrameNavigator.navigate({
			windowClass,
			frame,
			goToOptions: {
				...goToOptions,
				referrer: frame.url
			},
			url: history.currentItem.href,
			method: history.currentItem.method,
			formData: history.currentItem.formData,
			disableHistory: true
		});
	}
}
