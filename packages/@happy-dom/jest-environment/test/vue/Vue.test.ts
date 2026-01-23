import { createApp } from 'vue';
import { mount } from '@vue/test-utils';

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

	it('Component with SVG.', () => {
		const MessageComponent = {
			template: `
            <td data-v-d8968c14="">
                <div data-v-d8968c14="" data-balloon="Active" class="tooltip-active" data-balloon-pos="up"><svg data-v-d8968c14="" class="svg-inline--fa fa-circle no-status success" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-test-id="active-collection">
                    <path class="" fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path>
                </svg></div>
            </td>
            `,
			props: ['msg']
		};
		const wrapper = mount(MessageComponent, {
			propsData: {
				msg: 'Hello world'
			}
		});
		expect(wrapper.find('svg.success').exists()).toBe(true);
	});
});
