import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactTestingLibrary from '@testing-library/react';
import ReactTestingLibraryUserEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import {
	ReactDivComponent,
	ReactSelectComponent,
	ReactInputComponent,
	ReactClipboardComponent
} from './ReactComponents';
import * as Select from '@radix-ui/react-select';

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

	it('Tests integration.', async () => {
		act(() => {
			ReactDOM.createRoot(appElement).render(<ReactDivComponent />);
		});
		await new Promise((resolve) => setTimeout(resolve, 2));
		expect(appElement.innerHTML).toBe('<div>Test</div>');
	});

	it('Can unmount a component.', async () => {
		const root = ReactDOM.createRoot(appElement);
		act(() => {
			root.render(<ReactDivComponent />);
		});
		await new Promise((resolve) => setTimeout(resolve, 2));
		act(() => {
			root.unmount();
		});
		expect(appElement.innerHTML).toBe('');
	});

	it('Handles adding and removing event listeners.', () => {
		act(() => {
			ReactDOM.createRoot(appElement).render(<ReactSelectComponent onChange={() => {}} />);
		});
	});

	it('Testing library handles input', async () => {
		const { getByPlaceholderText } = ReactTestingLibrary.render(<ReactInputComponent />);
		const input: HTMLInputElement = getByPlaceholderText('input field') as HTMLInputElement;

		await TESTING_LIBRARY_USER.type(input, 'hello');

		expect(input.value).toBe('hello');
	});

	it('Can render Radix UI Select component.', async () => {
		act(() => {
			ReactDOM.createRoot(appElement).render(
				<Select.Root>
					<Select.Trigger>
						<Select.Value />
						<Select.Icon />
					</Select.Trigger>

					<Select.Portal>
						<Select.Content>
							<Select.ScrollUpButton />
							<Select.Viewport>
								<Select.Item value="1">
									<Select.ItemText />
									<Select.ItemIndicator />
								</Select.Item>

								<Select.Group>
									<Select.Label />
									<Select.Item value="2">
										<Select.ItemText />
										<Select.ItemIndicator />
									</Select.Item>
								</Select.Group>

								<Select.Separator />
							</Select.Viewport>
							<Select.ScrollDownButton />
							<Select.Arrow />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			);
		});
		await new Promise((resolve) => setTimeout(resolve, 2));
		expect(document.body.innerHTML).toBe(
			'<app><button type="button" role="combobox" aria-controls="radix-:r0:" aria-expanded="false" aria-autocomplete="none" dir="ltr" data-state="closed" data-placeholder=""><span style="pointer-events: none;"></span><span aria-hidden="true">▼</span></button></app>'
		);
	});

	it('Can use copy to clipboard hook component', async () => {
		const { getByRole } = ReactTestingLibrary.render(<ReactClipboardComponent />);
		expect(document.querySelector('p span').textContent).toBe('Nothing');
		const button: HTMLButtonElement = getByRole('button') as HTMLButtonElement;
		await TESTING_LIBRARY_USER.click(button);
		expect(document.querySelector('p span').textContent).toBe('test');
	});

	it('Can `preventDefault` to prevent navigation with React click listener on an anchor tag', async () => {
		location.href = 'http://localhost/';
		const { getByRole } = ReactTestingLibrary.render(
			<a href="http://example.com" onClick={(ev) => ev.preventDefault()} />
		);
		expect(document.location.href).toBe('http://localhost/');
		await TESTING_LIBRARY_USER.click(getByRole('link'));
		expect(document.location.href).toBe('http://localhost/');
	});
});
