![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

Pluggable canvas adapter for [Happy DOM](https://github.com/capricorn86/happy-dom) using [node-canvas](https://github.com/Automattic/node-canvas).

## Installation

```bash
npm install @happy-dom/node-canvas-adapter canvas
```

## Usage

![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

This package makes it possible to use [Happy DOM](https://github.com/capricorn86/happy-dom) with [Jest](https://jestjs.io/).

## Installation

```bash
npm install canvas @happy-dom/node-canvas-adapter
```

## Documentation

You will find the documentation in the [Happy DOM Wiki](https://github.com/capricorn86/happy-dom/wiki) under [Node Canvas Adapter](https://github.com/capricorn86/happy-dom/wiki/Node-Canvas-Adapter).

## Usage


```typescript
import { Window } from 'happy-dom';
import { CanvasAdapter } from '@happy-dom/node-canvas-adapter';

const window = new Window({
  settings: {
    canvasAdapter: new CanvasAdapter(),
    // Optionally, enable image file loading
    enableImageFileLoading: true
  }
});

const canvas = window.document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 200;
canvas.height = 200;

// Now you can use canvas context
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);

// Get data URL
const dataUrl = canvas.toDataURL();

// Output the data URL
console.log(dataUrl);
```

## Happy DOM

[Documentation](https://github.com/capricorn86/happy-dom/wiki/) | [Getting Started](https://github.com/capricorn86/happy-dom/wiki/Getting-started) | [Setup as Test Environment](https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment) | [GitHub](https://github.com/capricorn86/happy-dom/)