import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import GlobalRegistrator from '../../../lib/GlobalRegistrator.js';
import assert from 'node:assert';

describe('Angular', () => {
	let appElement: Element;

	before(async () => {
		GlobalRegistrator.register();
		await import('@angular/compiler');
	});

	after(async () => {
		await GlobalRegistrator.unregister();
	});

	beforeEach(async () => {
		appElement = document.createElement('app');
		document.body.appendChild(appElement);
	});

	afterEach(() => {
		document.body.removeChild(appElement);
	});

	it('Should create the app', async () => {
		const { bootstrapApplication } = await import('@angular/platform-browser');
		const AngularComponent = await import('./AngularComponent.js');
		await bootstrapApplication(AngularComponent.default);
		assert.strictEqual(document.body.innerHTML, `<app ng-version="22.0.0"><div>Test</div></app>`);
	});
});
