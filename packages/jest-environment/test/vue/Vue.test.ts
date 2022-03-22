import { createApp } from 'vue';

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

	it('Tests integration.', () => {
		const app = createApp({
			data() {
				return {
					message: 'Test'
				};
			}
		});
		app.mount('#app');
		expect(document.body.innerHTML).toBe('<div id="app" data-v-app="">Test</div>');
	});
});
