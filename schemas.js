const Joi = require('joi');

module.exports.homieSchema = Joi.object({
    homie: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required().min(18),
        location: Joi.string().required(),
        image: Joi.array(),
        description: Joi.string().required(),
        occupation: Joi.string().required(),
        status: Joi.string().required(),
        gender: Joi.string().required()
    }).required()
});