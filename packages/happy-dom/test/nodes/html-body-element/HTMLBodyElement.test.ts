
    import HTMLBodyElement from '../../../src/nodes/html-body-element/HTMLBodyElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLBodyElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLBodyElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('body');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLBodyElement', () => {
                expect(element instanceof HTMLBodyElement).toBe(true);
            });
        });
    });
    