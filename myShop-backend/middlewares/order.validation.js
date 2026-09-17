import Joi from 'joi';
import { validateSchema } from './validation.js';

// Check if a value follows the format of a order reference
const REF_PATTERN = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){4}$/;

// Validation middleware for insertion ////////////////////////////////////////
export const validateAddOrder = (req, res, next) => {
  const Schema = Joi.object({
    reference: Joi.string().pattern(REF_PATTERN).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    dateMod: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    products: Joi.array().items({
      productId: Joi.string().hex().length(24).required().messages({
        'string.base': 'The {{#label}} attribute must be a MongoDB identifier, a 24-character hexadecimal string',
        'string.hex': 'The {{#label}} attribute must be a MongoDB identifier, a 24-character hexadecimal string',
        'string.length': 'The {{#label}} attribute must be a MongoDB identifier, a 24-character hexadecimal string',
        'any.required': 'The {{#label}} attribut is mandatory',
      }),
      price: Joi.number().min(0.01).max(9999.99).required().messages({
        'number.base': 'The {{#label}} attribut must be a number',
        'number.min': 'The {{#label}} attribut must be a number greater than or equal to 0.01',
        'number.max': 'The {{#label}} attribut must be a number less than or equal to 9999.99',
        'any.required': 'The {{#label}} attribut is mandatory',
      }),
      quantity: Joi.number().min(1).max(99).integer().required().messages({
        'number.base': 'The {{#label}} attribut must be an integer',
        'number.integer': 'The {{#label}} attribut must be an integer',
        'number.min': 'The {{#label}} attribut must be an integer greater than or equal to 0.01',
        'number.max': 'The {{#label}} attribut must be a number less than or equal to 99',
        'any.required': 'The {{#label}} attribut is mandatory',
      }),
    }).min(1).required().messages({
      'array.base': 'The {{#label}} attribut must be an array',
      'array.min': 'The {{#label}} attribute must be an array containing at least 1 item',
      'any.required': 'The {{#label}} attribut attribut is mandatory',
    }),
    promoCode: Joi.string().min(0).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
    }),
    taxPercent: Joi.number().optional().messages({
      'number.base': 'The {{#label}} attribut must be a number',
    }),
    promoPercent: Joi.number().optional().messages({
      'number.base': 'The {{#label}} attribut must be a number',
    }),
    status: Joi.number().valid(0, 1, 2, 3, 4, 5, 6).required().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'any.only': 'The {{#label}} attribut must be one of the following values: {{#values}}',
      'any.required': 'The {{#label}} attribut attribut is mandatory',
    }),
    dateVisible: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut date must be a date',
    }),
    visible: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} attribut must be a boolean',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};

// Validation middleware for full or partial updates //////////////////////////
export const validateUpdOrder = (req, res, next) => {
  const Schema = Joi.object({
    reference: Joi.string().pattern(REF_PATTERN).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut',
    }),
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    dateMod: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    products: Joi.array().items({
      productId: Joi.string().hex().length(24).required().messages({
        'string.base': 'The {{#label}} attribute must be a MongoDB identifier, a 24-character hexadecimal string',
        'string.hex': 'The {{#label}} attribute must be a MongoDB identifier, a 24-character hexadecimal string',
        'string.length': 'The {{#label}} attribute must be a MongoDB identifier, a 24-character hexadecimal string',
        'any.required': 'The {{#label}} attribut is mandatory',
      }),
      price: Joi.number().min(0.01).max(9999.99).required().messages({
        'number.base': 'The {{#label}} attribut must be a number',
        'number.min': 'The {{#label}} attribut must be a number greater than or equal to 0.01',
        'number.max': 'The {{#label}} attribut must be a number less than or equal to 9999.99',
        'any.required': 'The {{#label}} attribut is mandatory',
      }),
      quantity: Joi.number().min(1).max(99).integer().required().messages({
        'number.base': 'The {{#label}} attribut must be an integer',
        'number.integer': 'The {{#label}} attribut must be an integer',
        'number.min': 'The {{#label}} attribut must be an integer greater than 0',
        'number.max': 'The {{#label}} attribut must be a number less than or equal to 99',
        'any.required': 'The {{#label}} attribut is mandatory',
      }),
    }).min(1).optional().messages({
      'array.base': 'The {{#label}} attribut must be an array',
      'array.min': 'The {{#label}} attribute must be an array containing at least 1 item',
    }),
    promoCode: Joi.string().min(0).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
    }),
    taxPercent: Joi.number().optional().messages({
      'number.base': 'The {{#label}} attribut must be a number',
    }),
    promoPercent: Joi.number().optional().messages({
      'number.base': 'The {{#label}} attribut must be a number',
    }),
    status: Joi.number().valid(0, 1, 2, 3, 4, 5, 6).optional().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'any.only': 'The {{#label}} attribut must be one of the following values: {{#values}}',
    }),
    dateVisible: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut date must be a date',
    }),
    visible: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} attribut must be a boolean',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};
