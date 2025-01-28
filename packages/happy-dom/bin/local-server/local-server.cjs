/* eslint-disable */

const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Server has started: http://localhost:${PORT}`));
