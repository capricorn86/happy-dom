:warning: **This package is deprecated. Happy DOM now supports [Declarative Shadow DOM](https://github.com/capricorn86/happy-dom/tree/master/packages/happy-dom#server-side-rendering-of-web-components) which can be used for server-side rendering of web components instead.** :warning:


![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)


# About

[Happy DOM](https://github.com/capricorn86/happy-dom) is a JavaScript implementation of a web browser without its graphical user interface. It includes many web standards from WHATWG [DOM](https://dom.spec.whatwg.org/) and [HTML](https://html.spec.whatwg.org/multipage/).

The goal of [Happy DOM](https://github.com/capricorn86/happy-dom) is to emulate enough of a web browser to be useful for testing, scraping web sites and server-side rendering.

[Happy DOM](https://github.com/capricorn86/happy-dom) focuses heavily on performance and can be used as an alternative to [JSDOM](https://github.com/jsdom/jsdom).

This package makes it easier to setup servering side rendering of web components by handling the setup of the Node [VM Context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options) for you.



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
npm install @happy-dom/server-rendering
```



# Usage


```javascript
import { HappyDOMContext } from '@happy-dom/server-rendering';
import { Script } from 'vm';

const context = new HappyDOMContext();
const result = await context.render({
    url: 'http://localhost:8080',
    evaluateScripts: true,
    html: `
        <html>
            <head>
                <title>Test page</title>
            </head>
            <body>
                <div class="container">
                    <!–– Content will be added here -->
                </div>
            </body>
        </html>
    `,
    // Optional scripts
    scripts: [
        new Script(`
            const element = document.createElement('div');
            const container = document.querySelector('.container');
            element.innerHTML = 'Test';
            container.appendChild(element);
        `)
    ],
    // Optional custom element settings
    customElements: {
        // Converts custom-elements to normal elements
        openShadowRoots: true,
        // Extracts CSS from shadow roots
        extractCSS: true,
        // Scopes extracted CSS
        scopeCSS: true,
        // Adds CSS to head
        addCSSToHead: true
    }
});

// Outputs: <html><head><title>Test page</title></head><body><div class="container"><div>Test</div></div></body></html>
console.log(result);
```


# Known Issues

The functionality of CSS scoping has not been completed, so you may encounter some problem where CSS is not scoped correctly.


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

