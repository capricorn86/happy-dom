export default `

    :host {
        display: flex;
        overflow: hidden;
        width: 100%;
    }

    .container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        --css-variable: 1px;
        background-image:
            url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="),
            url(test.jpg)
        ;
    }

    @media screen and (max-width: 36rem) {
        .container {
            height: 0.5rem;
            animation: keyframes2 2s linear infinite;
        }
    }

    @keyframes keyframes1 {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes keyframes2 {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    @unknown-rule {
        .unknown-class {
            text-spacing: 1px;
        }
    }

    @container (min-width: 36rem) {
        .container {
            color: red;
        }
    }

    @container containerName (min-width: 36rem) {
        .container {
            color: red;
        }
    }

    @supports (display: flex) {
        .container {
            color: green;
        }
    }

    /*
    * Multi-line comment with leading star
    */
    :root {
        --my-var: 10px;
    }

    /* Single-line comment */
    .foo { color: red; }

    ;

	.invalidAsThereIsASemicolon {
		color: red;
	}

    .validAsThereIsNoSemicolon {
        color: pink;
    }
`.trim();
