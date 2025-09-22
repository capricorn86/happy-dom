![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

This package makes it possible to register [Happy DOM](https://github.com/capricorn86/happy-dom) and makes it easy to setup your own test environment.

## Installation

```bash
npm install @happy-dom/global-registrator --save-dev
```

## Documentation

You will find the documentation in the [Happy DOM Wiki](https://github.com/capricorn86/happy-dom/wiki) under [Global Registrator](https://github.com/capricorn86/happy-dom/wiki/Global-Registrator).

## Usage

#### Register

```javascript
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register({ url: 'http://localhost:3000', width: 1920, height: 1080 });

document.body.innerHTML = `<button>My button</button>`;

const button = document.querySelector('button');

// Outputs: "My button"
console.log(button.innerText);
```

#### Unregister

```javascript
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

await GlobalRegistrator.unregister();

// Outputs: "undefined"
console.log(global.document);
```

## Happy DOM

[Documentation](https://github.com/capricorn86/happy-dom/wiki) | [Getting Started](https://github.com/capricorn86/happy-dom/wiki/Getting-started) | [Setup as Test Environment](https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment) | [GitHub](https://github.com/capricorn86/happy-dom/)