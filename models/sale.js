const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    customer: new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        },
        email: {
            type: String,
            minlength: 5,
            maxlength: 100
        },
        phone: {
            type: String,
            length: 8,
            validate: {
                validator: function (v) {
                    return v.match(PHONE_NUMBER_REGEX);
                },
                message: 'Invalid phone number!'
            }
        }
    }),
    movie: new mongoose.Schema({
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
        }
    }),
    date: {
        type: Date,
        default: Date.now()
    }
});

const Sale = mongoose.model('Sale', saleSchema);

function validateSale(sale) {
    const validationSchema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    const { error } = Joi.validate(sale, validationSchema);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Sale = Sale;
module.exports.validate = validateSale;