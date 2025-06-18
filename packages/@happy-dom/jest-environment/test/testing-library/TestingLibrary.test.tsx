import { render, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import React from 'react';

describe('TestingLibrary', () => {
	it('Triggers change event in input when typing.', async () => {
		const user = UserEvent.setup();
		const onChange = jest.fn();

		render(<input onChange={(event) => onChange(event.target.value)} />);

		await user.type(screen.getByRole('textbox'), 'hello');

		expect(onChange).toHaveBeenCalledWith('hello');
	});

	it('Triggers click and submit event once.', async () => {
		const user = UserEvent.setup();
		const handleSubmit = jest.fn((ev) => {
			ev.preventDefault();
		});
		const clickHandler = jest.fn();

		render(
			<form onSubmit={handleSubmit}>
				<button type="submit" onClick={clickHandler}>
					submit
				</button>
			</form>
		);

		await user.click(screen.getByRole('button'));

		expect(handleSubmit).toHaveBeenCalledTimes(1);
		expect(clickHandler).toHaveBeenCalledTimes(1);
	});

	it('Triggers change event once.', async () => {
		const user = UserEvent.setup();
		const changeHandler = jest.fn();

		render(<input type="checkbox" onChange={changeHandler} />);

		const checkbox = screen.getByRole('checkbox');

		await user.click(checkbox);

		expect(changeHandler).toHaveBeenCalledTimes(1);
	});

	it('Finds elements using "screen.getByText()".', async () => {
		const user = UserEvent.setup();
		const clickHandler = jest.fn();

		render(<input type="submit" value="Submit Button" onClick={clickHandler} />);

		const element = screen.getByText('Submit Button');

		await user.click(element);

		expect(clickHandler).toHaveBeenCalledTimes(1);
	});

	it('Finds element using "screen.getByRole()".', () => {
		render(<dialog open></dialog>);

		const element = screen.getByRole('dialog');

		expect(element).toBeInstanceOf(HTMLDialogElement);
	});

	it('Can use attribute.not.toMatch().', async () => {
		render(<input type="checkbox" value="test" />);

		const checkbox = screen.getByRole('checkbox');
		const attribute = checkbox.getAttribute('value');

		expect(attribute).toMatch('test');
		expect(attribute).not.toMatch('hello');
	});

	it('Removes and adds `open` attribute for `<details>` element on click event.', async () => {
		const user = UserEvent.setup();
		const handleToggle = jest.fn();

		render(
			<details open={true} onToggle={handleToggle}>
				<summary>summary</summary>details
			</details>
		);

		expect(document.body.innerHTML).toBe(
			'<div><details open=""><summary>summary</summary>details</details></div>'
		);
		expect(handleToggle).toHaveBeenCalledTimes(0);

		await user.click(screen.getByText('summary'));

		expect(document.body.innerHTML).toBe(
			'<div><details><summary>summary</summary>details</details></div>'
		);
		expect(handleToggle).toHaveBeenCalledTimes(1);

		await user.click(screen.getByText('summary'));

		expect(document.body.innerHTML).toBe(
			'<div><details open=""><summary>summary</summary>details</details></div>'
		);
		expect(handleToggle).toHaveBeenCalledTimes(2);
	});
});
