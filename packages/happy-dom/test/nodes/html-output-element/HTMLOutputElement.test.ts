
    import HTMLOutputElement from '../../../src/nodes/html-output-element/HTMLOutputElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLOutputElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLOutputElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('output');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLOutputElement', () => {
                expect(element instanceof HTMLOutputElement).toBe(true);
            });
        });
    });
    