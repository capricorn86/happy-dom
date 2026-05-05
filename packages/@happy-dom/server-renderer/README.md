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

Note that JavaScript is disabled by default. To enable JavaScript, use the flag `--javascript`. A VM Context is not an isolated environment, and if you run untrusted JavaScript code you are at risk of RCE (Remote Code Execution) attacks. [Read more about risks and recommended security precautions here](https://github.com/capricorn86/happy-dom/wiki/JavaScript-Evaluation-Warning).

**Example 1**

Render to the file `./happy-dom/render/gb/en/index.html`.

```bash
npx @happy-dom/server-renderer --javascript "https://example.com/gb/en/"
```

or if you have it installed

```bash
happy-dom-sr --javascript "https://example.com/gb/en/"
```

**Example 2**

Start proxy server.

```bash
happy-dom-sr --javascript --server --server.targetOrigin="https://example.com"
```

### JavaScript

See all available configuration options in the [Javascript API Documentation](https://github.com/capricorn86/happy-dom/wiki/ServerRenderer).

Note that JavaScript is disabled by default. To enable JavaScript, set the configuration `browser.enableJavaScriptEvaluation` to true. A VM Context is not an isolated environment, and if you run untrusted JavaScript code you are at risk of RCE (Remote Code Execution) attacks. [Read more about risks and recommended security precautions here](https://github.com/capricorn86/happy-dom/wiki/JavaScript-Evaluation-Warning).

**Example 1**

```javascript
import { ServerRenderer } from '@happy-dom/server-renderer';

const renderer = new ServerRenderer({
   // Your configuration options
   browser: {
      enableJavaScriptEvaluation: true,
   },
});

const result = await renderer.render(['https://example.com/gb/en/']);

// URL of the rendered page
console.log(result[0].url);

// The rendered HTML
console.log(result[0].content);
```

**Example 2**

```javascript
import { ServerRenderer } from '@happy-dom/server-renderer';

const renderer = new ServerRenderer({
   // Your configuration options
   browser: {
      enableJavaScriptEvaluation: true,
   },
});

const result = await renderer.render([{ url: 'https://example.com/gb/en/', html: '<div id="app"></div><script>document.getElementById("app").innerHTML = "Hello World!";</script>' }]);

// URL of the rendered page
console.log(result[0].url);

// The rendered HTML
console.log(result[0].content);
```

## Happy DOM

[Documentation](https://github.com/capricorn86/happy-dom/wiki) | [Getting Started](https://github.com/capricorn86/happy-dom/wiki/Getting-started) | [Setup as Test Environment](https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment) | [GitHub](https://github.com/capricorn86/happy-dom/)