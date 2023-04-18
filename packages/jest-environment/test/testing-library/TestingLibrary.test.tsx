import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('TestingLibrary', () => {
	it('Triggers change event in input when typing.', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();

		render(<input onChange={(event) => onChange(event.target.value)} />);

		await user.type(screen.getByRole('textbox'), 'hello');
		expect(onChange).toHaveBeenCalledWith('hello');
	});

	it('Triggers click and submit event once.', async () => {
		const user = userEvent.setup();
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
});
