const benny = require('benny');

function formatOutput(result) {
	return `${result.name}: ${result.ops.toLocaleString()} ops/s, ±${result.margin.toFixed(2)}%`;
}

function suite(name, ...benchmarks) {
	return benny.suite(
		name,
		...benchmarks,
		benny.cycle((result) => {
			// eslint-disable-next-line no-console
			console.log(formatOutput(result));
		})
	);
}

module.exports = {
	suite,
	benny
};
