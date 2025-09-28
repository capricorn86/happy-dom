![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

Use [Happy DOM](https://github.com/capricorn86/happy-dom) for server-side rendering (SSR) or static site generation (SSG).

The benefit of using this tool compared to other SSR and SSG solutions, is that it is not tied to a specific framework. For example, you can use React, Vue, Angular and Lit on the same page. The page is rendered as a whole and outputted as HTML.

This tool uses a worker pool by default to render multiple pages in parallel. Each worker can also render multiple pages in parallel that shares resources.


## Installation

```bash
npm install @happy-dom/server-renderer --save-dev
```

## Documentation

You will find the documentation in the [Happy DOM Wiki](https://github.com/capricorn86/happy-dom/wiki) under [Server-Renderer](https://github.com/capricorn86/happy-dom/wiki/Server-Renderer).

## Usage

### Command Line

See all available command line arguments in the [Command Line Documentation](https://github.com/capricorn86/happy-dom/wiki/Server-Renderer-CLI-Arguments).

**Example 1**

Render to the file `./happy-dom/render/gb/en/index.html`.

```bash
npx @happy-dom/server-renderer "https://example.com/gb/en/"
```

or if you have it installed

```bash
happy-dom-sr "https://example.com/gb/en/"
```

**Example 2**

Start proxy server.

```bash
happy-dom-sr --server --server.targetOrigin="https://example.com"
```

### JavaScript

See all available configuration options in the [Javascript API Documentation](https://github.com/capricorn86/happy-dom/wiki/ServerRenderer).

**Example**

```javascript
import { ServerRenderer } from '@happy-dom/server-renderer';

const renderer = new ServerRenderer({
  // Your configuration options
});

const result = await renderer.render(['https://example.com/gb/en/']);

// The rendered HTML
console.log(result[0].url);
console.log(result[0].content);
```

## Happy DOM

[Documentation](https://github.com/capricorn86/happy-dom/wiki) | [Getting Started](https://github.com/capricorn86/happy-dom/wiki/Getting-started) | [Setup as Test Environment](https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment) | [GitHub](https://github.com/capricorn86/happy-dom/)