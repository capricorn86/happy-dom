import XMLHttpRequest from '../../src/xml-http-request/XMLHttpRequest';
import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import XMLHttpRequestReadyStateEnum from '../../src/xml-http-request/XMLHttpRequestReadyStateEnum';

const URL = 'https://localhost:8080';

describe('XMLHttpRequest', () => {
	let window: IWindow;
	let request: XMLHttpRequest;

	beforeEach(() => {
		window = new Window();
		request = new window.XMLHttpRequest();
	});

	afterEach(() => {
		mockedModules.reset();
	});

	describe('get readyState()', () => {
		it('Returns ready state for synchrounous requests.', () => {
			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);

			request.open('GET', URL, false);
			request.send();

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
		});

		it('Returns ready state for asynchrounous requests.', (done) => {
			let isProgressTriggered = false;

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);

			request.open('GET', URL, true);

			request.addEventListener('progress', () => {
				isProgressTriggered = true;
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
			});

			request.addEventListener('load', () => {
				expect(isProgressTriggered).toBe(true);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				done();
			});

			request.send();
		});
	});

	describe('get responseText()', () => {
		it('Returns response text for synchrounous requests.', () => {
			request.open('GET', URL, false);
			request.send();
			expect(request.responseText).toBe('child_process.execFileSync.returnValue.data.text');
		});

		it('Returns response text for asynchrounous requests.', (done) => {
			request.open('GET', URL, true);
			request.addEventListener('load', () => {
				expect(request.responseText).toBe('http.request.body');
				done();
			});
			request.send();
		});
	});
});
