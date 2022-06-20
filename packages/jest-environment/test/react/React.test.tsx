import React from 'react';
import ReactDOM from 'react-dom';
import ReactComponent, { ReactSelectComponent } from './ReactComponent';

describe('React', () => {
	let appElement: Element;

	beforeEach(() => {
		appElement = document.createElement('app');
		document.body.appendChild(appElement);
	});

	afterEach(() => {
		document.body.removeChild(appElement);
	});

	it('Tests integration.', () => {
		ReactDOM.render(<ReactComponent />, appElement);
		expect(appElement.innerHTML).toBe('<div>Test</div>');
	});

	it('Can unmount a component.', () => {
		ReactDOM.render(<ReactComponent />, appElement);
		ReactDOM.unmountComponentAtNode(appElement);
		expect(appElement.innerHTML).toBe('');
	});

	it('Select tests integration.', () => {
		ReactDOM.render(<ReactSelectComponent />, appElement);
		expect(appElement.innerHTML).toBe(
			'<select><option value="t1">test 1</option><option value="t2" selected="">test 2</option></select>'
		);
	});
});
