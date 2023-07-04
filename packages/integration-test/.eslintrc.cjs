module.exports = require('happy-dom/.eslintrc.cjs');

const override = module.exports.overrides.find((override) => override.files.includes('*.js'));

override.extends = override.extends.filter((item) => !item.includes('jest'));
override.plugins = override.plugins.filter((item) => !item.includes('jest'));

for (const name of Object.keys(override.rules)) {
	if (name.includes('jest')) {
		delete override.rules[name];
	}
}
