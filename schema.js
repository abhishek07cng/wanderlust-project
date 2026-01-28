const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.any().optional(),


    wifiSpeed: Joi.number().required().min(1),
    workspaceAvailable: Joi.boolean()
      .truthy("on")
      .falsy("off")
      .default(false),

    longStayAllowed: Joi.boolean()
      .truthy("on")
      .falsy("off")
      .default(false),

    minStayDays: Joi.number().min(1).required(),
    // image: Joi.object({
    //   url: Joi.string().uri().allow("", null),
    //   filename: Joi.string().allow("", null),
    // }).required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});
