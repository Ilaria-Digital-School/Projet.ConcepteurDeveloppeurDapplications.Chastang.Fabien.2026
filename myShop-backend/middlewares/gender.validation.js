import Joi from 'joi';
import { validateSchema } from './validation.js';

// Validation middleware for insertion ////////////////////////////////////////
export const validateAddGender = (req, res, next) => {
  const Schema = Joi.object({
    value: Joi.number().valid(1, 2).required().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'any.only': 'The {{#label}} attribut must be one of the following values: {{#values}}',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    field: Joi.string().min(1).max(50).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    name: Joi.string().min(1).max(50).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};

// Validation middleware for full or partial updates //////////////////////////
export const validateUpdGender = (req, res, next) => {
  const Schema = Joi.object({
    value: Joi.number().valid(1, 2).optional().messages({
      'number.base': 'The {{#label}} attribut must be a number',
      'any.only': 'The {{#label}} attribut must be one of the following values: {{#values}}',
    }),
    field: Joi.string().min(1).max(50).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
    }),
    name: Joi.string().min(1).max(50).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};
