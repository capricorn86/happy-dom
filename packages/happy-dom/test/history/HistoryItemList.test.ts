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
				documentState: {
					url: 'about:blank',
					method: 'GET',
					formData: null,
					inheritOrigin: true
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			history.push({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			expect(history.currentItem).toEqual({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
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
					documentState: {
						url: 'about:blank',
						method: 'GET',
						formData: null,
						inheritOrigin: true
					},
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto
				}
			]);
			history.push({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					documentState: {
						url: 'about:blank',
						method: 'GET',
						formData: null,
						inheritOrigin: true
					},
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto
				},
				{
					title: 'Example',
					url: 'https://example.com',
					documentState: {
						url: 'https://example.com',
						method: 'GET',
						formData: null,
						inheritOrigin: false
					},
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto
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
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					documentState: {
						url: 'about:blank',
						method: 'GET',
						formData: null,
						inheritOrigin: true
					},
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto
				},
				{
					title: 'Example',
					url: 'https://example.com',
					documentState: {
						url: 'https://example.com',
						method: 'GET',
						formData: null,
						inheritOrigin: false
					},
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto
				}
			]);
			expect(history.currentItem).toEqual({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			history.push({
				title: 'Example 2',
				url: 'https://example2.com',
				documentState: {
					url: 'https://example2.com',
					method: 'POST',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.manual
			});
			expect(history.currentItem).toEqual({
				title: 'Example 2',
				url: 'https://example2.com',
				documentState: {
					url: 'https://example2.com',
					method: 'POST',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.manual
			});
		});

		it('Supports a standard source URL', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			expect(history.currentItem.documentState.url).toBe('https://example.com');
		});

		it('Supports a data URL as the source URL', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			expect(history.currentItem.documentState.url).toBe(
				'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
			);
		});
	});

	describe('replace()', () => {
		it('Replaces the current history item with a new one', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			history.replace({
				title: 'Example 2',
				url: 'https://example2.com',
				documentState: {
					url: 'https://example2.com',
					method: 'POST',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.manual
			});
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					documentState: {
						url: 'about:blank',
						method: 'GET',
						formData: null,
						inheritOrigin: true
					},
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto
				},
				{
					title: 'Example 2',
					url: 'https://example2.com',
					documentState: {
						url: 'https://example2.com',
						method: 'POST',
						formData: null,
						inheritOrigin: false
					},
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.manual
				}
			]);
			expect(history.currentItem).toEqual({
				title: 'Example 2',
				url: 'https://example2.com',
				documentState: {
					url: 'https://example2.com',
					method: 'POST',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.manual
			});
		});

		it('Supports a standard source URL', () => {
			const history = new HistoryItemList();
			history.replace({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			expect(history.currentItem.documentState.url).toBe('https://example.com');
		});

		it('Supports a data URL as the source URL', () => {
			const history = new HistoryItemList();
			history.replace({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			expect(history.currentItem.documentState.url).toBe(
				'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
			);
		});
	});

	describe('clear()', () => {
		it('Clears the history items and resets currentItem', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				url: 'https://example.com',
				documentState: {
					url: 'https://example.com',
					method: 'GET',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
			history.push({
				title: 'Example 2',
				url: 'https://example2.com',
				documentState: {
					url: 'https://example2.com',
					method: 'POST',
					formData: null,
					inheritOrigin: false
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.manual
			});
			history.clear();
			expect(history.items).toEqual([
				{
					title: '',
					url: 'about:blank',
					documentState: {
						url: 'about:blank',
						method: 'GET',
						formData: null,
						inheritOrigin: true
					},
					state: null,
					scrollRestoration: HistoryScrollRestorationEnum.auto
				}
			]);
			expect(history.currentItem).toEqual({
				title: '',
				url: 'about:blank',
				documentState: {
					url: 'about:blank',
					method: 'GET',
					formData: null,
					inheritOrigin: true
				},
				state: null,
				scrollRestoration: HistoryScrollRestorationEnum.auto
			});
		});
	});
});
