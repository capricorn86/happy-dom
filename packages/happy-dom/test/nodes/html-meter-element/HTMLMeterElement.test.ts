
    import HTMLMeterElement from '../../../src/nodes/html-meter-element/HTMLMeterElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLMeterElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLMeterElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('meter');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLMeterElement', () => {
                expect(element instanceof HTMLMeterElement).toBe(true);
            });
        });
    });
    