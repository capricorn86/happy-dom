import React from 'react';

/**
 *
 */
export default class ReactComponent extends React.Component<{}, void> {
	/**
	 * @override
	 */
	public render(): unknown {
		return <div>Test</div>;
	}
}

/**
 *
 */
export class ReactSelectComponent extends React.Component<{}, void> {
	/**
	 * @override
	 */
	public render(): unknown {
		return (
			<>
				<select value="t2" onChange={() => {}}>
					<option value="t1">test 1</option>
					<option value="t2">test 2</option>
				</select>
			</>
		);
	}
}
