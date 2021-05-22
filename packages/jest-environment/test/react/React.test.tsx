import React from 'react';
import ReactDOM from 'react-dom';
import ReactComponent from './ReactComponent';

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
});
