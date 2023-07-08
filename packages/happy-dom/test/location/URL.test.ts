import Window from '../../src/window/Window.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('URL', () => {
	let window: Window;
	beforeEach(() => {
		window = new Window();
	});
	describe('constructor()', () => {
		it('Parses "https://google.com/some-path/?key=value&key2=value2#hash".', () => {
			const href = 'https://google.com/some-path/?key=value&key2=value2#hash';
			const url = new window.URL(href);
			expect(url.href).toBe(href);
			expect(url.protocol).toBe('https:');
			expect(url.hostname).toBe('google.com');
			expect(url.port).toBe('');
			expect(url.pathname).toBe('/some-path/');
			expect(url.search).toBe('?key=value&key2=value2');
			expect(url.hash).toBe('#hash');
			expect(url.username).toBe('');
			expect(url.password).toBe('');
			expect(url.host).toBe('google.com');
			expect(url.origin).toBe('https://google.com');
		});

		it('Parses "https://user:password@google.com/some-path/".', () => {
			const href = 'https://user:password@google.com/some-path/';
			const url = new window.URL(href);
			expect(url.href).toBe(href);
			expect(url.protocol).toBe('https:');
			expect(url.hostname).toBe('google.com');
			expect(url.port).toBe('');
			expect(url.pathname).toBe('/some-path/');
			expect(url.search).toBe('');
			expect(url.hash).toBe('');
			expect(url.username).toBe('user');
			expect(url.password).toBe('password');
			expect(url.host).toBe('google.com');
			expect(url.origin).toBe('https://google.com');
		});

		it('Parses "https://google.com:8080/some-path/".', () => {
			const href = 'https://google.com:8080/some-path/';
			const url = new window.URL(href);
			expect(url.href).toBe(href);
			expect(url.protocol).toBe('https:');
			expect(url.hostname).toBe('google.com');
			expect(url.port).toBe('8080');
			expect(url.pathname).toBe('/some-path/');
			expect(url.search).toBe('');
			expect(url.hash).toBe('');
			expect(url.username).toBe('');
			expect(url.password).toBe('');
			expect(url.host).toBe('google.com:8080');
			expect(url.origin).toBe('https://google.com:8080');
		});
		it('Parses "https://google.com".', () => {
			const formatHref = 'https://google.com/';
			const href = 'https://google.com';
			const url = new window.URL(href);
			expect(url.href).toBe(formatHref);
			expect(url.protocol).toBe('https:');
			expect(url.hostname).toBe('google.com');
			expect(url.port).toBe('');
			expect(url.pathname).toBe('/');
			expect(url.search).toBe('');
			expect(url.hash).toBe('');
			expect(url.username).toBe('');
			expect(url.password).toBe('');
			expect(url.host).toBe('google.com');
			expect(url.origin).toBe('https://google.com');
		});
	});
});
