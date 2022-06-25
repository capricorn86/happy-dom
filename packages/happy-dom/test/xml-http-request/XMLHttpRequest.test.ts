import { XMLHttpRequest } from '../../lib/xml-http-request/xml-http-request';

describe('XMLHttpRequest', () => {
	let xhr: XMLHttpRequest;
	beforeEach(() => {
		xhr = new XMLHttpRequest();
	});

	it('XMLHttpRequest()', function () {
		xhr.open('GET', 'http://localhost:8080/path/to/resource/', false);
		xhr.addEventListener('load', () => {
			expect(this.status).toBe(200);
			expect(this.responseText).toBe('test');
			expect(this.response).toBe('test');
		});
		xhr.send();
	});
});
