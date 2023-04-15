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
});
