import GlobalRegistrator from '../../lib/GlobalRegistrator';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactComponent from './ReactComponent';

GlobalRegistrator.register();

const appElement = document.createElement('app');
document.body.appendChild(appElement);

function mountReactComponent(): void {
	ReactDOM.render(<ReactComponent />, appElement);

	if (appElement.innerHTML !== '<div>Test</div>') {
		throw Error('React not rendered correctly.');
	}
}

function unmountReactComponent(): void {
	ReactDOM.unmountComponentAtNode(appElement);

	if (appElement.innerHTML !== '') {
		throw Error('React not unmounted correctly.');
	}
}

mountReactComponent();
unmountReactComponent();

GlobalRegistrator.unregister();
