![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

Use Happy DOM for server-side rendering (SSR) or as a static site generation (SSG).

This tool uses a worker pool by default to render multiple pages in parallel. Each worker can also render multiple pages in parallel that shares resources.

The benefit of using this tool is that it is not tied to a specific framework. For example, you can use React, Vue, and Angular on the same page. The page is rendered as a whole and outputted as HTML.

Read more in the Wiki under [Help Packages / Server-Renderer](https://github.com/capricorn86/happy-dom/wiki/Server-Renderer).

## Installation

```bash
npm install @happy-dom/server-rendering --save-dev
```


## Usage

### Command Line

#### Basic Usage

This will output the result to the file `./happy-dom/render/gb/en/index.html`.

```bash
happy-dom-sr "https://example.com/gb/en/"
```

#### Configuration File

This will output the result to the file `./happy-dom/render/gb/en/index.html`.

Read more about the configuration options in the Wiki under [Help Packages / Server-Renderer / IServerRendererConfiguration](https://github.com/capricorn86/happy-dom/wiki/IServerRendererConfiguration).

```bash
happy-dom-sr --config=<path-to-config-file> "https://example.com/gb/en/"
```

#### Virtual Server
This will setup a virtual server that serves the content from the directory "./build" for requests towards "https://example.com/{cc}/{lc}/".

The result will be saved to the file "./happy-dom/render/gb/en/index.html".

```bash
happy-dom-sr --browser.fetch.virtualServer="https:\/\/example\.com\/[a-z]{2}\/[a-z]{2}\/"|"./build" "https://example.com/gb/en/"
```

#### Proxy Server
This will start a proxy server that proxies requests from "http://localhost:3000" to "https://example.com".

```bash
happy-dom-sr --server --server.targetOrigin="https://example.com"
```

#### Debugging
Some pages may have never ending timer loops causing the rendering to never complete or there may be other issues preventing the page from rendering correctly. You can enable debugging by adding the flag "--debug".

Setting the log level to 4 (debug) will provide even more information (default is 3).

Note that debug information is collected after the page rendering has timed out. The default rendering timeout is 30 seconds and can be changed using the flag "--render.timeout".

```bash
happy-dom-sr --debug --logLevel=4 "https://example.com/gb/en/"
```

### JavaScript

#### Basic Usage
```javascript
import { ServerRenderer } from '@happy-dom/server-rendering';

const renderer = new ServerRenderer({
  // Your configuration options
});

const result = await renderer.render(['https://example.com/gb/en/']);

// The rendered HTML
console.log(result[0].url);
console.log(result[0].content);
```

#### Virtual Server

This will setup a virtual server that serves the content from the directory "./build" for requests towards "https://example.com/{cc}/{lc}/".

The result will be saved to the files "./index_gb.html" and "./index_us.html".

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
    { url: 'https://example.com/gb/en/', outputFile: './index_gb.html', headers: { 'X-Test': 'true' } },
    { url: 'https://example.com/us/en/', outputFile: './index_us.html' },
]);
```

#### Keeping the Workers Alive

When used on a server, you may want to keep the workers alive between renders to avoid the overhead of starting new workers.

```javascript
import { ServerRenderer } from '@happy-dom/server-rendering';


const results = await renderer.render([
    'https://example.com/gb/en/',
    'https://example.com/us/en/',
], { keepAlive: true });

for(const result of results) {
    console.log(result.url);
    console.log(result.content);
}

// When you are done with rendering, close the workers
await renderer.close();
```

## Happy DOM

[Documentation](https://github.com/capricorn86/happy-dom/wiki) | [Getting Started](https://github.com/capricorn86/happy-dom/wiki/Getting-started) | [Setup as Test Environment](https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment) | [GitHub](https://github.com/capricorn86/happy-dom/)