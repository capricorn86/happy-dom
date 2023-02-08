import Response from '../../src/fetch/Response';
import Window from '../../src/window/Window';

beforeAll(() => {
	const window = new Window();
	Response._ownerDocument = window.document;
});

afterAll(() => {
	Response._ownerDocument = null;
});

describe('Response', () => {
	it('Forwards constructor arguments to base implementation.', async () => {
		const response = new Response('hello there', { status: 404 });

		expect(response.status).toBe(404);
		expect(await response.text()).toBe('hello there');
	});
});
