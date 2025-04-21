import { GlobalRegistrator } from '../../lib/index.js';
import { test, expect } from 'bun:test';

GlobalRegistrator.register();

/* eslint-disable no-undef */

const GETTERS = [
	'location',
	'history',
	'navigator',
	'screen',
	'sessionStorage',
	'localStorage',
	'opener',
	'scrollX',
	'pageXOffset',
	'scrollY',
	'pageYOffset',
	'CSS',
	'innerWidth',
	'innerHeight',
	'outerWidth',
	'outerHeight',
	'devicePixelRatio'
];

test('DOM', () => {
	document.body.innerHTML = `<button>My button</button>`;
	const button = document.querySelector('button');
	expect(button?.innerText).toEqual('My button');
});

test('CSS', () => {
	const style = document.createElement('style');

	document.head.appendChild(style);
	style.innerHTML = `
        body {
            background-color: red;
        }

        @media (min-width: 1000px) {
            body {
                background-color: green;
            }
        }
    `;

	expect(getComputedStyle(document.body).backgroundColor).toBe('green');
});

test('Add event listener', () => {
	const div = document.createElement('div');
	document.body.appendChild(div);

	document.body.addEventListener('click', () => {
		div.style.backgroundColor = 'green';
	});

	div.dispatchEvent(new Event('click', { bubbles: true }));

	expect(getComputedStyle(div).backgroundColor).toBe('green');
});

test('Window getters', () => {
	const included = [];
	const propertyNames = Object.getOwnPropertyNames(global);

	for (const name of GETTERS) {
		if (propertyNames.includes(name)) {
			included.push(name);
		}
	}

	expect(included).toEqual(GETTERS);
});

test('Window location', () => {
	location.href = 'https://example.com/';
	expect(location.href).toBe('https://example.com/');
});

test('Window options', () => {
	GlobalRegistrator.unregister();

	GlobalRegistrator.register({
		url: 'https://example.com/',
		width: 1920,
		height: 1080,
		settings: {
			navigator: {
				userAgent: 'Custom User Agent'
			}
		}
	});

	expect(location.href).toBe('https://example.com/');
	expect(innerWidth).toBe(1920);
	expect(innerHeight).toBe(1080);
	expect(navigator.userAgent).toBe('Custom User Agent');
});
