const express = require('express');
const bodyParser = require('body-parser');
const drinksRouter = require('./routes/drinks');
require('./redis');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/drinks', drinksRouter);

app.listen(PORT, () => {
  console.log('Server listening on port 3000');
});
