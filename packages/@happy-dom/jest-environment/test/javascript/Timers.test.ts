describe('Timers', () => {
	it('Should have setImmediate and clearImmediate defined on the global object', () => {
		expect(typeof setImmediate).toBe('function');
		expect(typeof clearImmediate).toBe('function');
	});

	it('Should be able to cancel a scheduled immediate with clearImmediate', (done) => {
		let executed = false;
		const immediateId = setImmediate(() => {
			executed = true;
		});

		clearImmediate(immediateId);

		setTimeout(() => {
			expect(executed).toBe(false);
			done();
		}, 10);
	});
});
