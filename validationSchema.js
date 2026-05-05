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

const review = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required().min(3).max(200),
  }).required(),
});

module.exports = { listing, review };
