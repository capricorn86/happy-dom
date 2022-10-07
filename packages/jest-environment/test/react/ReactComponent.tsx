import React from 'react';

/* eslint-disable @typescript-eslint/consistent-type-assertions */

/**
 *
 */
export class ReactComponent extends React.Component<{}, {}> {
	/**
	 * @override
	 */
	public render(): unknown {
		return <div>Test</div>;
	}
}

const OPTIONS = [
	{ value: 't1', label: 'test 1' },
	{ value: 't2', label: 'test 2' }
];

/**
 *
 */
export class ReactSelectComponent extends React.Component<
	{
		value?: string;
		onChange?: (value: string) => void;
	},
	{}
> {
	/**
	 * @override
	 */
	public render(): unknown {
		return (
			<select
				value={this.props.value || OPTIONS[0].value}
				onChange={
					this.props.onChange
						? (event: React.ChangeEvent) =>
								this.props.onChange((event.target as HTMLSelectElement).value)
						: undefined
				}
			>
				{OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	}
}

/**
 *
 */
export class ReactInputComponent extends React.Component<{}, {}> {
	/**
	 * @override
	 */
	public render(): unknown {
		return <input placeholder="input field" />;
	}
}
