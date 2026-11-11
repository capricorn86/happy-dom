import type IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type IGoToOptions from '../types/IGoToOptions.js';
import type Response from '../../fetch/Response.js';
import type BrowserWindow from '../../window/BrowserWindow.js';
import BrowserFrameFactory from './BrowserFrameFactory.js';
import BrowserFrameURL from './BrowserFrameURL.js';
import BrowserFrameValidator from './BrowserFrameValidator.js';
import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import type FormData from '../../form-data/FormData.js';
import HistoryScrollRestorationEnum from '../../history/HistoryScrollRestorationEnum.js';
import type IHistoryItem from '../../history/IHistoryItem.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import Fetch from '../../fetch/Fetch.js';
import BrowserFrameCrossOriginIsolation from './BrowserFrameCrossOriginIsolation.js';

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
	 * @param [options.historyItem] Existing history item to load (reload or traversal) instead of pushing a new one. It becomes the current item only if the navigation is allowed.
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
		historyItem?: IHistoryItem;
	}): Promise<Response | null> {
		const { windowClass, frame, url, formData, method, goToOptions, historyItem } = options;
		const exceptionObserver = frame.page.context.browser[PropertySymbol.exceptionObserver];
		const referrer = goToOptions?.referrer || frame.window.location.origin;
		const targetURL = BrowserFrameURL.getRelativeURL(frame, url);
		const targetURLWithoutHash = new URL(targetURL.href.split('#')[0]);
		const currentURLWithoutHash = new URL(frame.url.split('#')[0]);
		const inheritedOrigin = goToOptions?.inheritOrigin
			? BrowserFrameURL.getInheritableOrigin(frame)
			: null;
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
			targetURL.hash !== frame.window?.location.hash &&
			!historyItem
		) {
			const history = frame[PropertySymbol.history];

			history.push({
				title: '',
				url: targetURL.href,
				documentState: history.currentItem.documentState,
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.manual
			});

			frame.window.location[PropertySymbol.setURL](frame, targetURL.href);

			return null;
		}

		// Handle "javascript" protocol
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
			// We should only fallback to setting the URL if the navigation is disabled inside a detached browser frame.
			// Detached browser frames can't be navigated normally as they are created directly using "new Window()".
			// Navigating would destroy the window and reference to it.
			if (
				!frame.page.context.browser.settings.navigation.disableFallbackToSetURL &&
				BrowserFrameValidator.isDetachedBrowserFrame(frame)
			) {
				const history = frame[PropertySymbol.history];
				if (historyItem) {
					history.currentItem = historyItem;
				}
				frame.window.location[PropertySymbol.setURL](frame, targetURL.href);
				history.currentItem.url = targetURL.href;
				history.currentItem.documentState = {
					...history.currentItem.documentState,
					url: targetURL.href,
					inheritedOrigin: historyItem ? historyItem.documentState.inheritedOrigin : inheritedOrigin
				};
				BrowserFrameCrossOriginIsolation.isolate(frame);
			}

			return null;
		}

		// History management.
		const history = frame[PropertySymbol.history];

		if (historyItem) {
			// The new document is shared by all items of the entry's document state.
			history.currentItem = historyItem;
			historyItem.documentState.url = targetURL.href;
		} else {
			const navigationMethod = method || (formData ? 'POST' : 'GET');
			history.push({
				title: '',
				url: targetURL.href,
				documentState: {
					url: targetURL.href,
					method: navigationMethod,
					formData: formData || null,
					inheritedOrigin
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
		}

		// Store current Window state
		const previousWindow = frame.window;
		const previousAsyncTaskManager = frame[PropertySymbol.asyncTaskManager];
		const width = previousWindow.innerWidth;
		const height = previousWindow.innerHeight;
		const devicePixelRatio = previousWindow.devicePixelRatio;

		// Create new Window
		frame[PropertySymbol.asyncTaskManager] = new AsyncTaskManager(frame);
		(<BrowserWindow>frame.window) = new windowClass(frame, { url: targetURL.href, width, height });
		(<number>frame.window.devicePixelRatio) = devicePixelRatio;

		BrowserFrameCrossOriginIsolation.isolate(frame);

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

		// Popups should loose their opener references
		for (const popup of frame[PropertySymbol.openedPages]) {
			if (popup.mainFrame[PropertySymbol.opener]) {
				popup.mainFrame[PropertySymbol.opener].window = null;
				popup.mainFrame[PropertySymbol.opener].frame = null;
			}
			BrowserFrameCrossOriginIsolation.isolate(popup.mainFrame);
		}
		frame[PropertySymbol.openedPages].length = 0;

		// Handle "about" protocol URL
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
			const responseURL = new URL(response.url || targetURL.href);

			// Handles the "X-Frame-Options" header for child frames.
			if (frame.parentFrame) {
				const xFrameOptions = response.headers?.get('X-Frame-Options')?.toLowerCase();
				const isSameOrigin =
					responseURL.origin === frame.parentFrame.window[PropertySymbol.location].origin;

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

		// A redirect gives only this item a new document state, even if it ends at the original URL.
		// Other items of the previous document state keep it and load it again when traversed to.
		// @see https://html.spec.whatwg.org/multipage/browsing-the-web.html#create-navigation-params-by-fetching
		if (response.url && (response.redirected || response.url !== history.currentItem.url)) {
			frame.window[PropertySymbol.location][PropertySymbol.setURL](frame, response.url);
			history.currentItem.url = response.url;
			history.currentItem.documentState = {
				...history.currentItem.documentState,
				url: response.url
			};
			history.currentItem.state = null;
			BrowserFrameCrossOriginIsolation.isolate(frame);
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
		return this.navigateSteps({
			...options,
			steps: -1
		});
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
		return this.navigateSteps({
			...options,
			steps: 1
		});
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
		const historyItem = history.items[history.items.indexOf(history.currentItem) + steps];

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

		if (historyItem.documentState !== history.currentItem.documentState) {
			return BrowserFrameNavigator.navigate({
				windowClass,
				frame,
				goToOptions: {
					...goToOptions,
					referrer: frame.url
				},
				url: historyItem.url,
				method: historyItem.documentState.method,
				formData: historyItem.documentState.formData,
				historyItem
			});
		}

		history.currentItem = historyItem;
		frame.window.location[PropertySymbol.setURL](frame, historyItem.url);

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
			url: history.currentItem.url,
			method: history.currentItem.documentState.method,
			formData: history.currentItem.documentState.formData,
			historyItem: history.currentItem
		});
	}
}
