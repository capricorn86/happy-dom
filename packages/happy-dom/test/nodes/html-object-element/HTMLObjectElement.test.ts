
    import HTMLObjectElement from '../../../src/nodes/html-object-element/HTMLObjectElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLObjectElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLObjectElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('object');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLObjectElement', () => {
                expect(element instanceof HTMLObjectElement).toBe(true);
            });
        });
    });
    