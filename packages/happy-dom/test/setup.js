const mockedModuleNames = ['fs', 'child_process', 'http', 'https'];
const mockedModuleImplementations = {};

global.mockModule = (name, module) => {
	if (!mockedModuleNames.includes(name)) {
		throw new Error(
			`The module "${name}" is not mocked. Please add it to the mocked modules array in "setup.js".`
		);
	}
	mockedModuleImplementations[name] = module;
};

global.resetMockedModules = () => {
	mockedModuleImplementations = {};
};

for (const name of mockedModuleNames) {
	jest.mock(name, () => {
		return Object.assign(
			{},
			jest.requireActual('./utilities.js'),
			mockedModuleImplementations[name]
		);
	});
}
