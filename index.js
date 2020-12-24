const express = require('express');
const app = express();
const movies = require('./routes/movies');
const mongoose = require('mongoose');

app.use(express.json());
app.use('/api/movies', movies);

mongoose.connect('mongodb://localhost/movies')
    .then(() => console.log('Connected to the MongoDB...'))
    .catch(() => console.log('Could not connect to the database.'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}...`));