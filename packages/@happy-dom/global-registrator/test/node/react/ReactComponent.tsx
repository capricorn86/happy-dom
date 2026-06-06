import React from 'react';

/**
 *
 */
export default class ReactComponent extends React.Component<{}, {}> {
	public $props: any = {};

	/**
	 * @override
	 */
	public render(): React.ReactElement {
		return <div>Test</div>;
	}
}
