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
				sourceURL: null,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example',
				url: 'https://example.com',
				sourceURL: null,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem).toEqual({
				title: 'Example',
				url: 'https://example.com',
				sourceURL: null,
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
					sourceURL: null,
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
				sourceURL: null,
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
					sourceURL: null,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example',
					url: 'https://example.com',
					sourceURL: null,
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
				sourceURL: null,
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
					sourceURL: null,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example',
					url: 'https://example.com',
					sourceURL: null,
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
				sourceURL: null,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example 2',
				url: 'https://example2.com',
				sourceURL: null,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
			expect(history.currentItem).toEqual({
				title: 'Example 2',
				url: 'https://example2.com',
				sourceURL: null,
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
				sourceURL: 'https://example.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem.sourceURL).toBe('https://example.com');
		});

		it('Supports a data URL as the source URL', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				sourceURL: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem.sourceURL).toBe('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
		});

		it('Throws an error when pushing an history item with an opaque URL that is not a data URL as its source', () => {
			const history = new HistoryItemList();
			expect(() => {
				history.push({
					title: 'Example',
					url: 'https://example.com',
					sourceURL: 'about:blank',
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				});
			}).toThrow();
		});
	});

	describe('replace()', () => {
		it('Replaces the current history item with a new one', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				sourceURL: null,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.replace({
				title: 'Example 2',
				url: 'https://example2.com',
				sourceURL: null,
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
					sourceURL: null,
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example 2',
					url: 'https://example2.com',
					sourceURL: null,
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
				sourceURL: null,
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
				sourceURL: 'https://example.com',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem.sourceURL).toBe('https://example.com');
		});

		it('Supports a data URL as the source URL', () => {
			const history = new HistoryItemList();
			history.replace({
				title: 'Example',
				url: 'https://example.com',
				sourceURL: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem.sourceURL).toBe('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
		});

		it('Throws an error when pushing an history item with an opaque URL that is not a data URL as its source', () => {
			const history = new HistoryItemList();
			expect(() => {
				history.replace({
					title: 'Example',
					url: 'https://example.com',
					sourceURL: 'about:blank',
					state: null,
					popState: false,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				});
			}).toThrow();
		});
	});

	describe('clear()', () => {
		it('Clears the history items and resets currentItem', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				sourceURL: null,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example 2',
				url: 'https://example2.com',
				sourceURL: null,
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
					sourceURL: null,
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
				sourceURL: null,
				state: null,
				popState: false,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
		});
	});
});
