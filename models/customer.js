const Joi = require('joi');
const mongoose = require('mongoose');
const PHONE_NUMBER_REGEX = /^\d{8}$/

const customerSchema = new mongoose.Schema({
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
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const validationSchema = {
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(5).max(100).email(),
        phone: Joi.string().length(8).regex(new RegExp(PHONE_NUMBER_REGEX))
            .error(errors => {
                errors.forEach(error => {
                    if (error.type === 'string.regex.base') {
                        error.message = 'Invalid phone number!';
                    }
                });

                return errors;
            }),
        isGold: Joi.boolean()
    }

    const { error } = Joi.validate(customer, validationSchema);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;