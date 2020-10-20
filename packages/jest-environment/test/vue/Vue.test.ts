import Vue from 'vue/dist/vue.common.prod.js';

describe('Vue', () => {
	let appElement: Element;

	beforeEach(() => {
		appElement = document.createElement('div');
		appElement.id = 'app';
		appElement.innerHTML = '{{ message }}';
		document.body.appendChild(appElement);
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('Tests integration.', () => {
		new Vue({
			el: '#app',
			data: {
				message: 'Test'
			}
		});
		expect(document.body.innerHTML).toBe('<div id="app">Test</div>');
	});
});
