const { JSDOM } = require('jsdom');
const { Window } = require('happy-dom');
const { suite, benny } = require('./lib');

function runBenchmark(document) {
	const parent = document.createElement('div');
	const child = document.createElement('span');
	parent.appendChild(child);
}

suite(
	'Append Child',
	benny.add('JSDOM', () => {
		const dom = new JSDOM();
		runBenchmark(dom.window.document);
	}),
	benny.add('Happy DOM', () => {
		const window = new Window();
		runBenchmark(window.document);
	})
);
