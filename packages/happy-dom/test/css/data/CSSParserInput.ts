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

    @keyframes keyframes2 {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    @container (min-width: 36rem) {
        .container {
            color: red;
        }
    }

    @container name (min-width: 36rem) {
        .container {
            color: red;
        }
    }

    @container name (min-width: 36rem) {
        .container {
            color: red;
        }
    }
    
    @supports (display: flex) {
        .container {
            color: green;
        }
    }
`.trim();
