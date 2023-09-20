import GlobalRegistrator from '../../cjs/GlobalRegistrator.cjs';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactComponent from './ReactComponent.js';

const selfReferingProperties = ['self', 'top', 'parent', 'window'];

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const originalSetTimeout = global.setTimeout;

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

if (global.setTimeout !== window.setTimeout) {
	throw Error('Happy DOM function not registered.');
}

for (const property of selfReferingProperties) {
	if (global[property] !== global) {
		throw Error('Self refering property property was not registered.');
	}
}

mountReactComponent();
unmountReactComponent();

GlobalRegistrator.unregister();

if (global.setTimeout !== originalSetTimeout) {
	throw Error('Global property was not restored.');
}
