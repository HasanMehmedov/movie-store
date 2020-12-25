const Joi = require('joi');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    director: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    price: {
        type: Number,
        required: true,
        positive: true
    },
    decription: {
        type: String
    },
    inStock: {
        type: Number,
        required: true,
        default: 0,
        positive: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const validationSchema = {
        title: Joi.string().min(2).max(100).required(),
        director: Joi.string().min(5).max(255).required(),
        price: Joi.number().positive().required(),
        description: Joi.string(),
        inStock: Joi.number().positive().required()
    }

    const { error } = Joi.validate(movie, validationSchema);
    if(error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;