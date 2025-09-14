const { JSDOM } = require('jsdom');
const { Window } = require('happy-dom');
const { suite, benny } = require('./lib');

const HTML = '<div><span>Hello World</span></div>';

function runBenchmark(document) {
	document.body.innerHTML = HTML;
}

suite(
	'Inner HTML',
	benny.add('JSDOM', () => {
		const dom = new JSDOM();
		runBenchmark(dom.window.document);
	}),
	benny.add('Happy DOM', () => {
		const window = new Window();
		runBenchmark(window.document);
	})
);
