![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

# About

[Happy DOM](https://github.com/capricorn86/happy-dom) is a JavaScript implementation of a web browser without its graphical user interface. It includes many web standards from WHATWG [DOM](https://dom.spec.whatwg.org/) and [HTML](https://html.spec.whatwg.org/multipage/).

The goal of [Happy DOM](https://github.com/capricorn86/happy-dom) is to emulate enough of a web browser to be useful for testing, scraping web sites and server-side rendering.

[Happy DOM](https://github.com/capricorn86/happy-dom) focuses heavily on performance and can be used as an alternative to [JSDOM](https://github.com/jsdom/jsdom).

### DOM Features

- Custom Elements (Web Components)

- Shadow Root (Shadow DOM)

- Declarative Shadow DOM

- Mutation Observer

- Tree Walker

- Fetch

And much more..

### Works With

- [Google LitHTML](https://lit-html.polymer-project.org)

- [Google LitElement](https://lit-element.polymer-project.org)

- [React](https://reactjs.org)

- [Angular](https://angular.io/)

- [Vue](https://vuejs.org/)

# Installation

```bash
npm install happy-dom
```

# Usage

## Basic Usage

A simple example of how you can use Happy DOM.

```javascript
import { Window } from 'happy-dom';

const window = new Window();
const document = window.document;

document.body.innerHTML = '<div class="container"></div>';

const container = document.querySelector('.container');
const button = document.createElement('button');

container.appendChild(button);

// Outputs "<div class="container"><button></button></div>"
console.log(document.body.innerHTML);
```

## VM Context

The default Window class is a [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options). A [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options) will execute JavaScript code scoped within the context where the Window instance will be the global object.

```javascript
import { Window } from 'happy-dom';

const window = new Window({
	innerWidth: 1024,
	innerHeight: 768,
	url: 'http://localhost:8080'
});
const document = window.document;

document.write(`
    <html>
        <head>
             <title>Test page</title>
        </head>
        <body>
             <div class="container">
                  <!–– Content will be added here -->
             </div>
            <script>
                const element = document.createElement('div');
                const container = document.querySelector('.container');
                element.innerHTML = 'Test';
                container.appendChild(element);
            </script>
        </body>
    </html>
`);

// Will output "Test"
console.log(document.querySelector('.container div').innerHTML);
```

## Global Context

Happy DOM exports a class called GlobalWindow, which can be used to run Happy DOM in the global context instead of the default behaviour of running in a [VM context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options).

```javascript
import { Window, GlobalWindow } from 'happy-dom';

const vmWindow = new Window();
const globalWindow = new GlobalWindow();

// Will output "false"
console.log(vmWindow.Array === global.Array);

// Will output "true"
console.log(globalWindow.Array === global.Array);

globalWindow.eval('global.test = 1');

// Will output "1"
console.log(global.test);
```

## Server-Side Rendering of Web Components

The example below will show you how to server-side render a page with custom elements (web components) in Happy DOM. In the example we will use a new web feature called [Declarative Shadow DOM](https://chromestatus.com/feature/5191745052606464) to include the shadow roots in the HTML output.

[Declarative Shadow DOM](https://chromestatus.com/feature/5191745052606464) is only supported by Chromium based browsers. Unsupported browsers will safely fallback to being rendered using Javascript.

```javascript
import { Window } from 'happy-dom';

const window = new Window({
	innerWidth: 1024,
	innerHeight: 768,
	url: 'http://localhost:8080'
});
const document = window.document;

document.write(`
    <html>
        <head>
             <title>Test page</title>
        </head>
        <body>
            <div>
                <my-custom-element>
                    <span>Slotted content</span>
                </my-custom-element>
            </div>
            <script>
                class MyCustomElement extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }

                    connectedCallback() {
                        this.shadowRoot.innerHTML = \`
                            <style>
                                :host {
                                    display: inline-block;
                                    background: red;
                                }
                            </style>
                            <div><slot></slot></div>
                        \`;
                    }
                }

                customElements.define('my-custom-element', MyCustomElement);
            </script>
        </body>
    </html>
`);

/*
Will output:
<my-custom-element>
    <span>Slotted content</span>
    <template shadowroot="open">
        <style>
            :host {
                display: inline-block;
                background: red;
            }
        </style>
        <div><slot></slot></div>
    </template>
</my-custom-element>
*/
console.log(document.body.querySelector('div').getInnerHTML({ includeShadowRoots: true }));
```

## Additional Features

**whenAsyncComplete()**

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that is resolved when all async tasks has been completed.

```javascript
window.happyDOM.whenAsyncComplete().then(() => {
	// Do something when all async tasks are completed.
});
```

**cancelAsync()**

This method will cancel all running async tasks.

```javascript
window.setTimeout(() => {
	// This timeout will be canceled
});
window.happyDOM.cancelAsync();
```

**setInnerWidth()**

Sets the property `window.innerWidth` and dispatches a "resize" event.

```javascript
window.happyDOM.setInnerWidth(1920);
```

**setInnerHeight()**

Sets the property `window.innerHeight` and dispatches a "resize" event.

```javascript
window.happyDOM.setInnerHeight(1080);
```

**setURL()**

Sets the property `window.location.href`.

```javascript
window.happyDOM.setURL('https://localhost:3000');
```

## Settings

Settings can be sent to the constructor or by setting them on the "window.happyDOM.settings" property.

Set by constructor:

```javascript
const window = new Window({
	innerWidth: 1920,
	innerHeight: 1080,
	url: 'https://localhost:8080',
	settings: {
		disableJavaScriptFileLoading: true,
		disableJavaScriptEvaluation: true,
		disableCSSFileLoading: true,
		disableIframePageLoading: true,
		disableComputedStyleRendering: true,
		enableFileSystemHttpRequests: true,
        device: {
            mediaType: 'print',
            prefersColorScheme = 'dark
        }
	}
});
```

Set by property:

```javascript
const window = new Window();

window.happyDOM.settings.disableJavaScriptFileLoading = true;
window.happyDOM.settings.disableJavaScriptEvaluation = true;
window.happyDOM.settings.disableCSSFileLoading = true;
window.happyDOM.settings.disableIframePageLoading = true;
window.happyDOM.settings.disableComputedStyleRendering = true;
window.happyDOM.settings.enableFileSystemHttpRequests = true;
window.happyDOM.settings.device.mediaType = 'print';
window.happyDOM.settings.device.prefersColorScheme = 'dark';
```

**disableJavaScriptFileLoading**

Set it to "true" to disable JavaScript file loading. Defaults to "false".

**disableJavaScriptEvaluation**

Set it to "true" to completely disable JavaScript evaluation. Defaults to "false".

**disableCSSFileLoading**

Set it to "true" to disable CSS file loading in HTMLLinkElement. Defaults to "false".

**disableIframePageLoading**

Set it to "true" to disable page loading in HTMLIFrameElement. Defaults to "false".

**disableComputedStyleRendering**
Set it to "true" to disable the simulation of rendering when calculating computed style. The rendering process will convert values such as "rem", "em", "cm" etc. to pixels. However, it is currently very limited and will therefore not give the same result as the browser. Defaults to "false".

**enableFileSystemHttpRequests**

Set it to "true" to enable file system HTTP requests using XMLHttpRequest. Defaults to "false".

**device.mediaType**

Used by media queries. Acceptable values are "screen" or "print". Defaults to "screen".

**device.prefersColorScheme**

Used by media queries. Acceptable values are "light" or "dark". Defaults to "dark".

# Performance

| Operation                            | JSDOM   | Happy DOM |
| ------------------------------------ | ------- | --------- |
| Import / Require                     | 333 ms  | 45 ms     |
| Parse HTML                           | 256 ms  | 26 ms     |
| Serialize HTML                       | 65 ms   | 8 ms      |
| Render custom element                | 214 ms  | 19 ms     |
| querySelectorAll('tagname')          | 4.9 ms  | 0.7 ms    |
| querySelectorAll('.class')           | 6.4 ms  | 3.7 ms    |
| querySelectorAll('[attribute]')      | 4.0 ms  | 1.7 ms    |
| querySelectorAll('[class~="name"]')  | 5.5 ms  | 2.9 ms    |
| querySelectorAll(':nth-child(2n+1)') | 10.4 ms | 3.8 ms    |

[See how the test was done here](https://github.com/capricorn86/happy-dom-performance-test)

# Jest

Happy DOM provide with a package called [@happy-dom/jest-environment](https://github.com/capricorn86/happy-dom/tree/master/packages/jest-environment) that makes it possible to use Happy DOM with [Jest](https://jestjs.io/).

# Global Registration

Happy DOM provide with a package called [@happy-dom/global-registrator](https://github.com/capricorn86/happy-dom/tree/master/packages/global-registrator) that can register Happy DOM globally. It makes it possible to use Happy DOM for testing in a Node environment.

# Sponsors

[<img alt="RTVision" width="120px" src="https://avatars.githubusercontent.com/u/8292810?s=200&v=4" />](https://rtvision.com)
