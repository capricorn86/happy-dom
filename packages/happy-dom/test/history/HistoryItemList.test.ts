import HistoryScrollRestorationEnum from '../../src/history/HistoryScrollRestorationEnum.js';
import { describe, it, expect } from 'vitest';
import HistoryItemList from '../../src/history/HistoryItemList.js';

describe('HistoryItemList', () => {
	describe('get currentItem()', () => {
		it('Returns the current history item.', () => {
			const history = new HistoryItemList();
			expect(history.currentItem).toEqual({
				title: '',
				url: 'about:blank',
				navigationURL: 'about:blank',
				inheritOrigin: true,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem).toEqual({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
		});
	});

	describe('get items()', () => {
		it('Returns the history items.', () => {
			const history = new HistoryItemList();
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					navigationURL: 'about:blank',
					inheritOrigin: true,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
			history.push({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					navigationURL: 'about:blank',
					inheritOrigin: true,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example',
					url: 'https://example.com',
					navigationURL: 'https://example.com',
					inheritOrigin: false,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
		});
	});

	describe('push()', () => {
		it('Adds an history item to the list and sets currentItem to the new item', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					navigationURL: 'about:blank',
					inheritOrigin: true,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example',
					url: 'https://example.com',
					navigationURL: 'https://example.com',
					inheritOrigin: false,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
			expect(history.currentItem).toEqual({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example 2',
				url: 'https://example2.com',
				navigationURL: 'https://example2.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
			expect(history.currentItem).toEqual({
				title: 'Example 2',
				url: 'https://example2.com',
				navigationURL: 'https://example2.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
		});

		it('Supports a standard source URL', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem.navigationURL).toBe('https://example.com');
		});

		it('Supports a data URL as the source URL', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem.navigationURL).toBe('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
		});
	});

	describe('replace()', () => {
		it('Replaces the current history item with a new one', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.replace({
				title: 'Example 2',
				url: 'https://example2.com',
				navigationURL: 'https://example2.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					navigationURL: 'about:blank',
					inheritOrigin: true,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example 2',
					url: 'https://example2.com',
					navigationURL: 'https://example2.com',
					inheritOrigin: false,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.manual,
					method: 'POST',
					formData: null
				}
			]);
			expect(history.currentItem).toEqual({
				title: 'Example 2',
				url: 'https://example2.com',
				navigationURL: 'https://example2.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
		});

		it('Supports a standard source URL', () => {
			const history = new HistoryItemList();
			history.replace({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem.navigationURL).toBe('https://example.com');
		});

		it('Supports a data URL as the source URL', () => {
			const history = new HistoryItemList();
			history.replace({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem.navigationURL).toBe('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
		});
	});

	describe('clear()', () => {
		it('Clears the history items and resets currentItem', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				navigationURL: 'https://example.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example 2',
				url: 'https://example2.com',
				navigationURL: 'https://example2.com',
				inheritOrigin: false,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
			history.clear();
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					navigationURL: 'about:blank',
					inheritOrigin: true,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
			expect(history.currentItem).toEqual({
				title: '',
				url: 'about:blank',
				navigationURL: 'about:blank',
				inheritOrigin: true,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
		});
	});
});
