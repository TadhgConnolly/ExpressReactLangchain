const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello Backend World!'));

app.listen(port, () => console.log(`Listening on port ${port}!`));

app.post('/send-message', (req, res) => {
    console.log(req.body.message); // Later, replace this with function calls
    res.status(200).send('Message received');
  });