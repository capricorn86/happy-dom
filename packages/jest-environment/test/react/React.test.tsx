import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactTestingLibrary from '@testing-library/react';
import ReactTestingLibraryUserEvent from '@testing-library/user-event';
import { ReactDivComponent, ReactSelectComponent, ReactInputComponent } from './ReactComponents';

/* eslint-disable @typescript-eslint/consistent-type-assertions */

const TESTING_LIBRARY_USER = ReactTestingLibraryUserEvent.setup();

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
		ReactDOM.render(<ReactDivComponent />, appElement);
		expect(appElement.innerHTML).toBe('<div>Test</div>');
	});

	it('Can unmount a component.', () => {
		ReactDOM.render(<ReactDivComponent />, appElement);
		ReactDOM.unmountComponentAtNode(appElement);
		expect(appElement.innerHTML).toBe('');
	});

	it('Handles adding and removing event listeners.', () => {
		ReactDOM.render(<ReactSelectComponent onChange={() => {}} />, appElement);
	});

	it('Testing library handles input', async () => {
		const { getByPlaceholderText } = ReactTestingLibrary.render(<ReactInputComponent />);
		const input: HTMLInputElement = getByPlaceholderText('input field') as HTMLInputElement;

		await TESTING_LIBRARY_USER.type(input, 'hello');

		expect(input.value).toBe('hello');
	});
});
