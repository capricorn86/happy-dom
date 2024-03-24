
    import HTMLTableRowElement from '../../../src/nodes/html-table-row-element/HTMLTableRowElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLTableRowElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLTableRowElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('tr');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLTableRowElement', () => {
                expect(element instanceof HTMLTableRowElement).toBe(true);
            });
        });
    });
    