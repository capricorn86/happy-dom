import Window from '../lib/Window';

describe('Window', () => {
	let window;

	beforeEach(() => {
		window = new Window();
	});

    describe('requestAnimationFrame()', () => {
        test('Requests an animation frame.', (done) => {
            const timeoutId = window.requestAnimationFrame(done);
            expect(timeoutId.constructor.name).toBe('Timeout');
        });
    });

    describe('cancelAnimationFrame()', () => {
        test('Cancels an animation frame.', () => {
            const timeoutId = window.requestAnimationFrame(() => {
                throw new Error('This timeout should have been canceled.')
            });
            window.cancelAnimationFrame(timeoutId);
        });
    });
});
