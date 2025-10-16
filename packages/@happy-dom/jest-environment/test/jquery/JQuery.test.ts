import JQuery from 'jquery';

describe('JQuery', () => {
	beforeEach(() => {
		document.body.innerHTML = `
            <div class="class1 class2" id="id">
                <!-- Comment 1 !-->
                <b>Bold</b>
                <!-- Comment 2 !-->
                <span>Span</span>
            </div>
            <article class="class1 class2" id="id">
                <!-- Comment 1 !-->
                <b>Bold</b>
                <!-- Comment 2 !-->
            </article>
        `;
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('Tests integration.', () => {
		JQuery('span').addClass('test-span');
		expect(document.body.children[0].children[1].getAttribute('class')).toBe('test-span');
	});
});
