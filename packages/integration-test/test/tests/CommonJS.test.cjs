const { Window } = require('happy-dom');

const window = new Window();
const document = window.document;

const element = document.createElement('div');
element.innerHTML = 'Test';

document.body.appendChild(element);

if (document.body.innerHTML !== '<div>Test</div>') {
	throw new Error(`CommonJS doesn't work.`);
}
