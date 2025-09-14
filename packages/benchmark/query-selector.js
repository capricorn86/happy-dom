const { JSDOM } = require('jsdom');
const { Window } = require('happy-dom');
const { suite, benny } = require('./lib');

const HTML = `<div><span class="foo"></span></div>`;

function runBenchmark(document) {
	document.querySelector('.foo');
}

suite(
	'Query Selector',
	benny.add('JSDOM', () => {
		const dom = new JSDOM(HTML);
		runBenchmark(dom.window.document);
	}),
	benny.add('Happy DOM', () => {
		const window = new Window();
		window.document.body.innerHTML = HTML;
		runBenchmark(window.document);
	})
);
