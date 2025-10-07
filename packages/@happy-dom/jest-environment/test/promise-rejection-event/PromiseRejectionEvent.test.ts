describe('PromiseRejectionEvent', () => {
	it('Should be available on global window object', () => {
		expect(window.PromiseRejectionEvent).toBeDefined();
		expect(typeof window.PromiseRejectionEvent).toBe('function');
	});

	it('Should be available on global scope', () => {
		expect(PromiseRejectionEvent).toBeDefined();
		expect(typeof PromiseRejectionEvent).toBe('function');
		expect(PromiseRejectionEvent).toBe(window.PromiseRejectionEvent);
	});

	it('Should create valid PromiseRejectionEvent instances', () => {
		const promise = Promise.reject('test error').catch(() => {}); // Handle rejection
		const event = new PromiseRejectionEvent('unhandledrejection', {
			promise: promise,
			reason: 'test error'
		});

		expect(event).toBeInstanceOf(Event);
		expect(event).toBeInstanceOf(PromiseRejectionEvent);
		expect(event.type).toBe('unhandledrejection');
		expect(event.promise).toBe(promise);
		expect(event.reason).toBe('test error');
	});

	it('Should work with event listeners', () => {
		const promise = Promise.reject('test error').catch(() => {}); // Handle rejection
		const event = new PromiseRejectionEvent('unhandledrejection', {
			promise: promise,
			reason: 'test error'
		});

		let receivedEvent: PromiseRejectionEvent | null = null;

		const listener = (e: Event): void => {
			receivedEvent = <PromiseRejectionEvent>e;
		};

		window.addEventListener('unhandledrejection', listener);
		window.dispatchEvent(event);
		window.removeEventListener('unhandledrejection', listener);

		expect(receivedEvent).toBe(event);
		expect(receivedEvent?.promise).toBe(promise);
		expect(receivedEvent?.reason).toBe('test error');
	});

	it('Should throw error when promise is not provided', () => {
		expect(() => {
			// @ts-ignore - Testing error case
			new PromiseRejectionEvent('unhandledrejection');
		}).toThrow('PromiseRejectionEvent constructor requires a promise in eventInit');
	});
});
