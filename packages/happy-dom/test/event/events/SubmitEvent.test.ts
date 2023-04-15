import Event from '../../../src/event/Event';
import SubmitEvent from '../../../src/event/events/SubmitEvent';
import HTMLButtonElement from '../../../src/nodes/html-button-element/HTMLButtonElement';

describe('SubmitEvent', () => {
	describe('constructor', () => {
		it('Creates a submit event.', () => {
			const submitter = new HTMLButtonElement();
			const event = new SubmitEvent('submit', { bubbles: true, submitter });
			expect(event).toBeInstanceOf(Event);
			expect(event.bubbles).toBe(true);
			expect(event.cancelable).toBe(false);
			expect(event.submitter).toBe(submitter);
		});
	});
});
