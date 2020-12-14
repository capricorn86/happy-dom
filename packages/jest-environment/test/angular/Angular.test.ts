import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import 'zone.js';
import AngularModule from './AngularModule';

describe('React', () => {
	let appElement: Element;

	beforeEach(() => {
		appElement = document.createElement('app');
		document.body.appendChild(appElement);
	});

	afterEach(() => {
		document.body.removeChild(appElement);
	});

	test('Tests integration with Angular.', async () => {
		enableProdMode();
		await platformBrowserDynamic().bootstrapModule(AngularModule);
		debugger;
		expect(appElement.innerHTML).toBe('<div>Test</div>');
	});
});
