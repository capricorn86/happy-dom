import { vi } from 'vitest';

const mockedModuleNames = ['fs', 'child_process', 'http', 'https'];
const mockedModuleImplementations = {};
const mockedModuleOriginals = {};

global['mockModule'] = (name, module) => {
	if (!mockedModuleNames.includes(name)) {
		throw new Error(
			`The module "${name}" is not mocked. Please add it to the mocked modules array in "setup.js".`
		);
	}

	if (!mockedModuleImplementations[name]) {
		throw new Error(
			`The module "${name}" has not been imported and the mocking has not been invoked.`
		);
	}

	for (const key of Object.keys(module)) {
		mockedModuleImplementations[name][key] = module[key];
	}

	mockedModuleImplementations[name]['default'] = mockedModuleImplementations[name];
};

global['resetMockedModules'] = () => {
	for (const name of mockedModuleNames) {
		mockedModuleImplementations[name] = Object.assign(
			mockedModuleImplementations[name],
			mockedModuleOriginals[name]
		);
	}
};

vi.mock('fs', async (importOriginal) => {
	if (!mockedModuleImplementations['fs']) {
		const original = await importOriginal();
		mockedModuleOriginals['fs'] = original;
		mockedModuleImplementations['fs'] = Object.assign({}, original);
		mockedModuleImplementations['fs'].default =
			mockedModuleImplementations['fs'].default || mockedModuleImplementations['fs'];
	}
	return mockedModuleImplementations['fs'];
});

vi.mock('child_process', async (importOriginal) => {
	if (!mockedModuleImplementations['child_process']) {
		const original = await importOriginal();
		mockedModuleOriginals['child_process'] = original;
		mockedModuleImplementations['child_process'] = Object.assign({}, original);
		mockedModuleImplementations['child_process'].default =
			mockedModuleImplementations['child_process'].default ||
			mockedModuleImplementations['child_process'];
	}
	return mockedModuleImplementations['child_process'];
});

vi.mock('http', async (importOriginal) => {
	if (!mockedModuleImplementations['http']) {
		const original = await importOriginal();
		mockedModuleOriginals['http'] = original;
		mockedModuleImplementations['http'] = Object.assign({}, original);
		mockedModuleImplementations['http'].default =
			mockedModuleImplementations['http'].default || mockedModuleImplementations['http'];
	}
	return mockedModuleImplementations['http'];
});

vi.mock('https', async (importOriginal) => {
	if (!mockedModuleImplementations['https']) {
		const original = await importOriginal();
		mockedModuleOriginals['https'] = original;
		mockedModuleImplementations['https'] = Object.assign({}, original);
		mockedModuleImplementations['https'].default =
			mockedModuleImplementations['https'].default || mockedModuleImplementations['https'];
	}
	return mockedModuleImplementations['https'];
});
