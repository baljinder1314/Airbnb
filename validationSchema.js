const Joi = require("joi");

const listing = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().required(),
    image: Joi.string().uri().allow("", null),
    price: Joi.number().min(1).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }),
});

module.exports = listing;
