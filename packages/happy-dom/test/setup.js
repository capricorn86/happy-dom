const mockedModuleNames = ['fs', 'child_process', 'http', 'https'];
const mockedModuleImplementations = {};

global.mockModule = (name, module) => {
	if (!mockedModuleNames.includes(name)) {
		throw new Error(
			`The module "${name}" is not mocked. Please add it to the mocked modules array in "setup.js".`
		);
	}

	for (const key of Object.keys(module)) {
		mockedModuleImplementations[name][key] = module[key];
	}
};

global.resetMockedModules = () => {
	for (const name of mockedModuleNames) {
		const actual = jest.requireActual(name);

		for (const key of Object.keys(actual)) {
			mockedModuleImplementations[name][key] = actual[key];
		}
	}
};

for (const name of mockedModuleNames) {
	mockedModuleImplementations[name] = jest.requireActual(name);

	jest.mock(name, () => {
		return mockedModuleImplementations[name];
	});
}
