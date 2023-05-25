module.exports = require('happy-dom/.eslintrc');

for (const override of module.exports.overrides.filter(
	(override) => override.files.includes('*.ts') || override.files.includes('*.js')
)) {
	override.exports = override.exports.filter((item) => !item.includes('jest'));
	override.plugins = override.plugins.filter((item) => !item.includes('jest'));

	for (const name of Object.keys(override.rules)) {
		if (name.includes('jest')) {
			delete override.rules[name];
		}
	}
}
