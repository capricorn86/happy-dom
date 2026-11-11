import { describe, it, expect, vi } from 'vitest';
import Browser from '../../../src/browser/Browser';
import BrowserFrameFactory from '../../../src/browser/utilities/BrowserFrameFactory';
import BrowserErrorCaptureEnum from '../../../src/browser/enums/BrowserErrorCaptureEnum';
import * as PropertySymbol from '../../../src/PropertySymbol';

describe('BrowserFrameFactory', () => {
	describe('createChildFrame()', () => {
		it('Adds the child frame to the parent frame.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);

			expect(childFrame.parentFrame).toBe(page.mainFrame);
			expect(page.mainFrame.childFrames).toEqual([childFrame]);
			expect(childFrame.window.parent).toBe(page.mainFrame.window);
			expect(childFrame.window.top).toBe(page.mainFrame.window);
			expect(childFrame[PropertySymbol.contentWindow]).toBe(childFrame.window);

			await browser.close();
		});
	});

	describe('destroyFrame()', () => {
		it('Destroys the frame.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const grandChildFrame = BrowserFrameFactory.createChildFrame(childFrame);
			const childWindow = childFrame.window;
			const grandChildWindow = grandChildFrame.window;

			await BrowserFrameFactory.destroyFrame(childFrame);

			expect(childFrame.closed).toBe(true);
			expect(childFrame.window).toEqual({ closed: true });
			expect(childFrame.window).not.toBe(childWindow);
			expect(childFrame.childFrames).toEqual([]);
			expect(childFrame[PropertySymbol.contentWindow]).toBe(null);
			expect(childFrame[PropertySymbol.opener]).toBe(null);

			expect(grandChildFrame.closed).toBe(true);
			expect(grandChildFrame.window).toEqual({ closed: true });
			expect(grandChildFrame.window).not.toBe(grandChildWindow);

			expect(page.mainFrame.closed).toBe(false);

			await browser.close();
		});

		it('Removes the frame from the child frames of the parent frame.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const childFrame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);

			await BrowserFrameFactory.destroyFrame(childFrame1);

			expect(page.mainFrame.childFrames).toEqual([childFrame2]);
			expect(childFrame2.closed).toBe(false);

			await browser.close();
		});

		it('Destroys the window and the async task manager of the frame.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const frame = page.mainFrame;
			const window = frame.window;
			const asyncTaskManager = frame[PropertySymbol.asyncTaskManager];
			const windowDestroy = vi.spyOn(window, PropertySymbol.destroy);
			const asyncTaskManagerDestroy = vi.spyOn(asyncTaskManager, 'destroy');

			await BrowserFrameFactory.destroyFrame(frame);

			expect(windowDestroy).toHaveBeenCalledTimes(1);
			expect(asyncTaskManagerDestroy).toHaveBeenCalledTimes(1);

			await browser.close();
		});

		it('Aborts running timers in the frame.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const timer = vi.fn();

			childFrame.window.setTimeout(timer, 100);

			await BrowserFrameFactory.destroyFrame(childFrame);
			await new Promise((resolve) => setTimeout(resolve, 200));

			expect(timer).not.toHaveBeenCalled();

			await browser.close();
		});

		it('Returns immediately if the frame is already closed.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const asyncTaskManagerDestroy = vi.spyOn(
				childFrame[PropertySymbol.asyncTaskManager],
				'destroy'
			);

			await BrowserFrameFactory.destroyFrame(childFrame);
			await BrowserFrameFactory.destroyFrame(childFrame);

			expect(asyncTaskManagerDestroy).toHaveBeenCalledTimes(1);

			await browser.close();
		});

		it('Resolves without any further action if the frame has no window.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const asyncTaskManagerDestroy = vi.spyOn(
				childFrame[PropertySymbol.asyncTaskManager],
				'destroy'
			);

			(<object | null>childFrame.window) = null;

			await BrowserFrameFactory.destroyFrame(childFrame);

			expect(childFrame.closed).toBe(true);
			expect(asyncTaskManagerDestroy).not.toHaveBeenCalled();
			expect(page.mainFrame.childFrames).toEqual([childFrame]);

			await browser.close();
		});

		it('Disconnects the window from the exception observer.', async () => {
			const browser = new Browser({
				settings: { errorCapture: BrowserErrorCaptureEnum.processLevel }
			});
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const window = childFrame.window;
			const disconnect = vi.spyOn(browser[PropertySymbol.exceptionObserver]!, 'disconnect');

			await BrowserFrameFactory.destroyFrame(childFrame);

			expect(disconnect).toHaveBeenCalledWith(window);

			await browser.close();
		});

		it('Clears navigation listeners.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);

			childFrame[PropertySymbol.listeners].navigation.push(() => {});

			await BrowserFrameFactory.destroyFrame(childFrame);

			expect(childFrame[PropertySymbol.listeners].navigation).toEqual([]);

			await browser.close();
		});

		it('Removes the page of the frame from the opened pages of the opener frame.', async () => {
			const browser = new Browser();
			const openerPage = browser.newPage();
			const popupPage1 = browser.newPage();
			const popupPage2 = browser.newPage();

			for (const popupPage of [popupPage1, popupPage2]) {
				popupPage.mainFrame[PropertySymbol.opener] = {
					frame: openerPage.mainFrame,
					window: openerPage.mainFrame.window
				};
				openerPage.mainFrame[PropertySymbol.openedPages].push(popupPage);
			}

			await BrowserFrameFactory.destroyFrame(popupPage1.mainFrame);

			expect(openerPage.mainFrame[PropertySymbol.openedPages]).toEqual([popupPage2]);
			expect(popupPage1.mainFrame[PropertySymbol.opener]).toBe(null);

			await browser.close();
		});

		it('Removes the opener reference from popups opened by the frame.', async () => {
			const browser = new Browser();
			const openerPage = browser.newPage();
			const popupPage = browser.newPage();
			const popupWindow = popupPage.mainFrame.window;

			popupPage.mainFrame[PropertySymbol.opener] = {
				frame: openerPage.mainFrame,
				window: openerPage.mainFrame.window
			};
			openerPage.mainFrame[PropertySymbol.openedPages].push(popupPage);

			await BrowserFrameFactory.destroyFrame(openerPage.mainFrame);

			expect(openerPage.mainFrame[PropertySymbol.openedPages]).toEqual([]);
			expect(popupPage.mainFrame.closed).toBe(false);
			expect(popupPage.mainFrame.window).toBe(popupWindow);
			expect(popupPage.mainFrame[PropertySymbol.opener]).toBe(null);
			expect(popupWindow.opener).toBe(null);

			await browser.close();
		});
	});
});
