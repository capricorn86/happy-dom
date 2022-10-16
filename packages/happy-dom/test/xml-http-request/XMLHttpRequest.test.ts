import XMLHttpRequest from '../../src/xml-http-request/XMLHttpRequest';
import Window from '../../src/window/Window';

describe('XMLHttpRequest', () => {
	let window: Window;
	// @ts-ignore
	let xhr: XMLHttpRequest;
	beforeEach(() => {
		window = new Window();
		xhr = new window.XMLHttpRequest();
	});

	it('XMLHttpRequest()', () => {
		// TODO: Implement
	});
});
