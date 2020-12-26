const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Sale, validate } = require('../models/sale');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

Fawn.init(mongoose);

router.get('/', async (req, res) => {

    try {
        const sales = await getSales();
        res.send(sales);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.get('/:id', async (req, res) => {

    const saleId = req.params.id;

    try {
        const sale = await getSale(saleId);
        res.send(sale);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', async (req, res) => {

    try {
        validate(req.body);

        const result = await createSale(req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getSales() {

    const sales = await Sale.find();

    if (!sales || sales.length === 0) {
        const notFoundError = new Error('There are no saved sales.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return sales;
}

async function getSale(id) {

    const sale = await Sale.findById(id);

    if (!sale) {
        const notFoundError = new Error(`Sale with id: ${id} does not exist.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return sale;
}

async function createSale(params) {

    const customerId = params.customerId;
    const customer = await getCustomer(customerId);

    const movieId = params.movieId;
    const movie = await getMovie(movieId);

    if (movie.inStock === 0) {
        throw new Error('Movie\'s out of stock.');
    }

    const sale = new Sale({
        customer: {
            _id: customerId,
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        },
        movie: {
            _id: movieId,
            title: movie.title,
            director: movie.director,
            price: movie.price
        }
    });

    try {
        new Fawn.Task()
            .save('sales', sale)
            .update('movies', { _id: movie._id }, {
                $inc: { inStock: -1 }
            })
            .run();
    }
    catch (err) {
        const systemError = new Error('Something failed.');
        systemError.status = 500;
        throw systemError;
    }

    return sale;
}

async function getCustomer(id) {

    const customer = await Customer.findById(id);

    if (!customer) {
        const notFoundError = new Error(`Customer with id: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customer;
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

module.exports = router;