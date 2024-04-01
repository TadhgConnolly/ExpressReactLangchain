require('dotenv').config();

const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

const dataProcessingRoute = require('./routes/dataProcessingRoute');

app.use(dataProcessingRoute);

app.get('/', (req, res) => res.send('Hello Backend World!'));

app.listen(port, () => console.log(`Listening on port ${port}!`));