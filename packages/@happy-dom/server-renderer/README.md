![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

Use Happy DOM for server-side rendering (SSR) or as a static site generator (SSG).

The server rendering module uses a worker pool by default to render multiple pages in parallel. Each worker can also render multiple pages in parallel.

The benefit of using this server rendering module is that it is not tied to a specific framework. For example, you can use React, Vue, and Angular on the same page. The server rendering module will render the page as a whole and return the HTML.

## Installation

```bash
npm install @happy-dom/server-rendering --save-dev
```

## Usage

### Command Line

#### Basic Usage

This will output the result to the file `./happy-dom-sr/output/gb/en/index.html`.

```bash
happy-dom-sr --config=<path-to-config-file> "https://example.com/gb/en/"
```

#### Virtual Server
This will setup a virtual server that serves the content from the directory "./build" for requests towards "https://example.com/{cc}/{lc}/".

The result will be saved to the files "./happy-dom-sr/output/gb/en/index.html" and "./happy-dom-sr/output/us/en/index.html".

This is useful for static site generation (SSG) (e.g. after a Vite or Webpack build).

```bash
happy-dom-sr --browser.fetch.virtualServer="https:\/\/example\.com\/[a-z]{2}\/[a-z]{2}\/">"./build" "https://example.com/gb/en/" "https://example.com/us/en/"
```

### JavaScript

#### Basic Usage
```javascript
import { ServerRenderer } from '@happy-dom/server-rendering';

const renderer = new ServerRenderer({
  // Your configuration options
});

const result = await renderer.render([{ url: 'https://example.com/gb/en/' }]);

// The rendered HTML
console.log(result[0].url);
console.log(result[0].content);
```

#### Virtual Server

This will setup a virtual server that serves the content from the directory "./build" for requests towards "https://example.com/{cc}/{lc}/".

The result will be saved to the files "./index_gb.html" and "./index_us.html".

This is useful for static site generation (SSG) (e.g. after a Vite or Webpack build).

```javascript
import { ServerRenderer } from '@happy-dom/server-rendering';

const renderer = new ServerRenderer({
  browser: {
    fetch: {
      virtualServers: [{
        url: /https:\/\/example\.com\/[a-z]{2}\/[a-z]{2}\//,
        directory: './build',
      }]
    },
  }
});

await renderer.render([
    { url: 'https://example.com/gb/en/', outputFile: './index_gb.html' },
    { url: 'https://example.com/us/en/', outputFile: './index_us.html' },
]);
```

## Happy DOM

[Documentation](https://github.com/capricorn86/happy-dom/wiki) | [Getting Started](https://github.com/capricorn86/happy-dom/wiki/Getting-started) | [Setup as Test Environment](https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment) | [GitHub](https://github.com/capricorn86/happy-dom/)