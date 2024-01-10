import Window from '../../src/window/Window.js';
import IWindow from '../../src/window/IWindow.js';
import Navigator from '../../src/navigator/Navigator.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Permissions from '../../src/permissions/Permissions.js';
import Clipboard from '../../src/clipboard/Clipboard.js';
import PackageVersion from '../../src/version.js';
import IResponse from '../../src/fetch/types/IResponse.js';
import IRequest from '../../src/fetch/types/IRequest.js';
import Fetch from '../../src/fetch/Fetch.js';
import Stream from 'stream';

const GET_NAVIGATOR_PLATFORM = (): string => {
	return (
		'X11; ' +
		process.platform.charAt(0).toUpperCase() +
		process.platform.slice(1) +
		' ' +
		process.arch
	);
};
const PROPERTIES = {
	appCodeName: 'Mozilla',
	appName: 'Netscape',
	appVersion: `5.0 (${GET_NAVIGATOR_PLATFORM()}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${
		PackageVersion.version
	}`,
	cookieEnabled: true,
	credentials: null,
	doNotTrack: 'unspecified',
	geolocation: null,
	hardwareConcurrency: 8,
	language: 'en-US',
	languages: ['en-US', 'en'],
	locks: null,
	maxTouchPoints: 0,
	mimeTypes: {
		length: 0
	},
	onLine: true,
	permissions: new Permissions(),
	platform: GET_NAVIGATOR_PLATFORM(),
	plugins: {
		length: 0
	},
	product: 'Gecko',
	productSub: '20100101',
	userAgent: `Mozilla/5.0 (${GET_NAVIGATOR_PLATFORM()}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${
		PackageVersion.version
	}`,
	vendor: '',
	vendorSub: '',
	webdriver: true
};

describe('Window', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window();
	});

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Is instanceof Navigator.', () => {
			expect(window.navigator instanceof Navigator).toBe(true);
		});
	});

	Object.keys(PROPERTIES).forEach((property) => {
		describe(`get ${property}()`, () => {
			it('Returns an instance of Navigator with browser data.', () => {
				expect(window.navigator[property]).toEqual(PROPERTIES[property]);
			});
		});
	});

	describe('get clipboard()', () => {
		it('Returns an instance of Clipboard.', () => {
			expect(window.navigator.clipboard).toEqual(new Clipboard(window));
		});
	});

	describe('sendBeacon()', () => {
		it('Sends a beacon request.', async () => {
			const expectedURL = 'https://localhost:8080/path/';
			let request: IRequest | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				request = <IRequest>this.request;
				return Promise.resolve(<IResponse>{});
			});

			window.navigator.sendBeacon(expectedURL, 'test-data');

			const chunks: Buffer[] = [];

			for await (const chunk of <Stream.Readable>(<IRequest>(<unknown>request)).body) {
				chunks.push(Buffer.from(chunk));
			}

			expect(Buffer.concat(chunks).toString()).toBe('test-data');
			expect((<IRequest>(<unknown>request)).url).toBe(expectedURL);
		});
	});
});
