# @happy-dom/node-canvas-adapter

Pluggable canvas adapter for [happy-dom](https://github.com/capricorn86/happy-dom) using [node-canvas](https://github.com/Automattic/node-canvas).

## Installation

\`\`\`bash
npm install @happy-dom/node-canvas-adapter canvas
\`\`\`

## Usage

\`\`\`typescript
import { Window } from 'happy-dom';
import { CanvasAdapter } from '@happy-dom/node-canvas-adapter';

const window = new Window({
  settings: {
    canvasAdapter: new CanvasAdapter()
  }
});

const canvas = window.document.createElement('canvas');
const ctx = canvas.getContext('2d');
\`\`\`
