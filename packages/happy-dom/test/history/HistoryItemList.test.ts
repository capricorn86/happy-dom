import IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import Browser from '../../src/browser/Browser.js';
import HistoryScrollRestorationEnum from '../../src/history/HistoryScrollRestorationEnum.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import HistoryItemList from '../../src/history/HistoryItemList.js';

describe('HistoryItemList', () => {
	describe('get currentItem()', () => {
		it('Returns the current history item.', () => {
			const history = new HistoryItemList();
			expect(history.currentItem).toEqual({
				title: '',
				href: 'about:blank',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example',
				href: 'https://example.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.currentItem).toEqual({
				title: 'Example',
				href: 'https://example.com',
				state: null,
				navigation: true,
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
					href: 'about:blank',
					state: null,
					navigation: true,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
			history.push({
				title: 'Example',
				href: 'https://example.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.items).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					navigation: true,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example',
					href: 'https://example.com',
					state: null,
					navigation: true,
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
				href: 'https://example.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			expect(history.items).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					navigation: true,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example',
					href: 'https://example.com',
					state: null,
					navigation: true,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
			expect(history.currentItem).toEqual({
				title: 'Example',
				href: 'https://example.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example 2',
				href: 'https://example2.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
			expect(history.currentItem).toEqual({
				title: 'Example 2',
				href: 'https://example2.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
		});
	});

	describe('replace()', () => {
		it('Replaces the current history item with a new one', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				href: 'https://example.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.replace({
				title: 'Example 2',
				href: 'https://example2.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
			expect(history.items).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					navigation: true,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				},
				{
					title: 'Example 2',
					href: 'https://example2.com',
					state: null,
					navigation: true,
					scrollRestoration: HistoryScrollRestorationEnum.manual,
					method: 'POST',
					formData: null
				}
			]);
			expect(history.currentItem).toEqual({
				title: 'Example 2',
				href: 'https://example2.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
		});
	});

	describe('clear()', () => {
		it('Clears the history items and resets currentItem', () => {
			const history = new HistoryItemList();
			history.push({
				title: 'Example',
				href: 'https://example.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
			history.push({
				title: 'Example 2',
				href: 'https://example2.com',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: 'POST',
				formData: null
			});
			history.clear();
			expect(history.items).toEqual([
				{
					title: '',
					href: 'about:blank',
					state: null,
					navigation: true,
					scrollRestoration: HistoryScrollRestorationEnum.auto,
					method: 'GET',
					formData: null
				}
			]);
			expect(history.currentItem).toEqual({
				title: '',
				href: 'about:blank',
				state: null,
				navigation: true,
				scrollRestoration: HistoryScrollRestorationEnum.auto,
				method: 'GET',
				formData: null
			});
		});
	});
});
