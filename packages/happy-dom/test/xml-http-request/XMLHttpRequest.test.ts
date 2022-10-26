import XMLHttpRequest from '../../src/xml-http-request/XMLHttpRequest';
import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';

describe('XMLHttpRequest', () => {
	let window: IWindow;
	let xmlHttpRequest: XMLHttpRequest;

	beforeEach(() => {
		window = new Window();
		xmlHttpRequest = new window.XMLHttpRequest();
	});

	afterEach(() => {
		global['resetMockedModules']();
	});

	describe('get responseText()', () => {
		it('Returns response text for a sync request.', () => {
			// TODO: Implement.
		});
	});
});
