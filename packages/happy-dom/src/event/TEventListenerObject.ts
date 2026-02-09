import type Event from './Event.js';

export type TEventListenerObject = {
	handleEvent(event: Event): void;
};
