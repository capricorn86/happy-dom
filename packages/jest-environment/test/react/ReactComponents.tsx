import React from 'react';

/* eslint-disable @typescript-eslint/consistent-type-assertions */

/**
 *
 */
export class ReactDivComponent extends React.Component<{}, {}> {
	public $props = {};

	/**
	 * @override
	 */
	public render(): React.ReactElement {
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
	public $props = {
		value: OPTIONS[0].value,
		onChange: null
	};

	/**
	 * @override
	 */
	public render(): React.ReactElement {
		return (
			<select
				value={this.props.value}
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
	public $props = {};

	/**
	 * @override
	 */
	public render(): React.ReactElement {
		return <input placeholder="input field" />;
	}
}
