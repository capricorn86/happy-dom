export default `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
</head>
<body>
    <h1></h1>
    <script>
        setTimeout(() => {
            document.querySelector('h1').textContent = 'Path: ' + location.pathname;
        }, 10);
    </script>

</body></html>`;
