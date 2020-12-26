const express = require('express');
const mongoose = require('mongoose');
const app = express();
const movies = require('./routes/movies');
const customers = require('./routes/customers');
const sales = require('./routes/sales');

app.use(express.json());
app.use('/api/movies', movies);
app.use('/api/customers', customers);
app.use('/api/sales', sales);

mongoose.connect('mongodb://localhost/movies')
    .then(() => console.log('Connected to the MongoDB...'))
    .catch(() => console.log('Could not connect to the database.'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}...`));