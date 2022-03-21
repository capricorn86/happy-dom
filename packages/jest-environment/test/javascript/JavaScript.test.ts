describe('JavaScript', () => {
	it('Functions should have the constructor global.Function', () => {
		expect((() => {}).constructor).toBe(Function);
	});

	it('Object should have the constructor global.Object', () => {
		expect({}.constructor).toBe(Object);
	});
});
