const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');

router.get('/', async (req, res) => {

    try {
        const movies = await getMovies();
        res.send(movies);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.get('/:id', async (req, res) => {

    const movieId = req.params.id;

    try {
        const movie = await getMovie(movieId);
        res.send(movie);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', async (req, res) => {

    try {
        validate(req.body);

        const result = await createMovie(req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.put('/:id', async (req, res) => {

    const movieId = req.params.id;

    try {
        const result = await updateMovie(movieId, req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getMovies() {

    const movies = await Movie.find();

    if (!movies || movies.length === 0) {
        const notFoundError = new Error('There are no saved movies.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return movies;
}

async function getMovie(id) {
    const movie = await Movie.findById(id);

    if (!movie) {
        const notFoundError = new Error(`Movie with id: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return movie;
}

async function createMovie(params) {
    const movie = new Movie({
        title: params.title,
        director: params.director,
        price: params.price,
        description: params.description,
        inStock: params.inStock
    });

    await movie.save();

    return movie;
}

async function updateMovie(id, params) {
    const movie = await getMovie(id);

    if (!params.title) {
        params.title = movie.title;
    }
    if (!params.director) {
        params.director = movie.director;
    }
    if (!params.price) {
        params.price = movie.price;
    }
    if (!params.description) {
        params.description = movie.description;
    }
    if (!params.inStock) {
        params.inStock = movie.inStock;
    }

    validate(params);

    movie.set({
        title: params.title,
        director: params.director,
        price: params.price,
        description: params.description,
        inStock: params.inStock
    });

    await movie.save();

    return movie;
}

module.exports = router;