# @happy-dom/node-canvas-adapter

[![npm version](https://badge.fury.io/js/@happy-dom%2Fnode-canvas-adapter.svg)](https://www.npmjs.com/package/@happy-dom/node-canvas-adapter)
[![License](https://img.shields.io/github/license/capricorn86/happy-dom.svg)](https://github.com/capricorn86/happy-dom/blob/master/LICENSE)

Pluggable canvas adapter for [happy-dom](https://github.com/capricorn86/happy-dom) using [node-canvas](https://github.com/Automattic/node-canvas).

## Installation

```bash
npm install @happy-dom/node-canvas-adapter canvas
```

## Usage

```typescript
import { Window } from 'happy-dom';
import { CanvasAdapter } from '@happy-dom/node-canvas-adapter';

const window = new Window({
  settings: {
    canvasAdapter: new CanvasAdapter()
  }
});

const canvas = window.document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Now you can use canvas context
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);

// Get data URL
const dataURL = canvas.toDataURL();

// Get blob
canvas.toBlob((blob) => {
  console.log(blob);
});
```

## API

### CanvasAdapter

The `CanvasAdapter` class implements the `ICanvasAdapter` interface and delegates rendering to the `canvas` npm package.

#### Methods

- `getContext(canvas, contextType, contextAttributes)` - Creates a rendering context for the given canvas element.
- `toDataURL(canvas, type, quality)` - Serializes the canvas content as a data URL.
- `toBlob(canvas, callback, type, quality)` - Creates a Blob from the canvas content.

## License

MIT License - see [LICENSE](https://github.com/capricorn86/happy-dom/blob/master/LICENSE) for details.
