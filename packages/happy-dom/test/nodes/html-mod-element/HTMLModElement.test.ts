
    import HTMLModElement from '../../../src/nodes/html-mod-element/HTMLModElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLModElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLModElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('ins');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLModElement', () => {
                expect(element instanceof HTMLModElement).toBe(true);
            });
        });
    });
    