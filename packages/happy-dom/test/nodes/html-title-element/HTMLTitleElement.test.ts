
    import HTMLTitleElement from '../../../src/nodes/html-title-element/HTMLTitleElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLTitleElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLTitleElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('title');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLTitleElement', () => {
                expect(element instanceof HTMLTitleElement).toBe(true);
            });
        });
    });
    