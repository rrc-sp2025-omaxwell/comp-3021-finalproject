import Joi from "joi";

export const productSchemas = {
    create: {
        body: Joi.object({
            id: Joi.string()
            .required()
            .max(20)
            .messages({
                "any.required": "product id is required",
                "string.empty": "product id cannot be empty"
            }),

            name: Joi.string()
            .required()
            .min(2)
            .max(80)
            .messages({
                "any.required": "product name is required",
                "string.empty": "product name cannot be empty",
                "string.min": "product name must be at least two characters long",
                "string.max": "product name cannot be greater than eighty characters long"
            }),

            sku: Joi.string()
            .required()
            .regex(/^[A-Z]{3}\d{4}$/)
            .messages({
                "any.required": "product sku is required",
                "string.empty": "product sku cannot be empty",
                "object.regex": "invalid pattern, sku must have 3 uppercase letters and 4 numbers (e.g. ABC1234)"
            }),

            quantity: Joi.number()
            .required()
            .integer()
            .positive()
            .messages({
                "any.required": "product quantity is required",
                "number.empty": "product quantity cannot be empty",
                "number.integer": "product quantity must be a integer",
                "number.positive": "product quantity must be a positive number"
            }),

            price: Joi.number()
            .required()
            .precision(2)
            .positive()
            .messages(
                {
                "any.required": "product price is required",
                "number.empty": "product price cannot be empty",
                "number.precision": "product price cannot have more than two decimal places",
                "number.positive": "product price must be a positive number" 
                
            }),

            category: Joi.string()
            .required()
            .valid("electronics", "clothing", "food", "tools", "other")
            .messages({
                "any.required": "product category is required",
                "string.empty": "product category cannot be empty",
                "any.only": "category must be one of: electronics, clothing, food, tools, other"
            })
        })
    },

    getById: {
        params: Joi.object({
            id: Joi.string()
                .required()
                .messages({
                    "any.required": "product id is required",
                    "string.empty": "product id cannot be empty",
                })
        }),
    },

    update: {
        params: Joi.object({
            id: Joi.string()
                .required()
                .messages({
                    "any.required": "product id is required",
                    "string.empty": "product id cannot be empty",
                })
        }),
        body: Joi.object({
            name: Joi.string()
                .optional()
                .min(2)
                .max(80)
                .messages({
                    "string.empty": "product name cannot be empty",
                    "string.min": "product name must be at least two characters long",
                    "string.max": "product name cannot be greater than eighty characters long"
                }),
            quantity: Joi.number()
                .optional()
                .integer()
                .positive()
                .messages({
                    "number.empty": "product quantity cannot be empty",
                    "number.integer": "product quantity must be a integer",
                    "number.positive": "product quantity must be a positive number"
                }),
            price: Joi.number()
                .optional()
                .precision(2)
                .positive()
                .messages({
                    "number.empty": "product price cannot be empty",
                    "number.precision": "product price cannot have more than two decimal places",
                    "number.positive": "product price must be a positive number"
                }),
            category: Joi.string()
                .optional()
                .valid("electronics", "clothing", "food", "tools", "other")
                .messages({
                    "string.empty": "product category cannot be empty",
                    "any.only": "category must be one of: electronics, clothing, food, tools, other"
                }),
        })
    },
    
    delete: {
        params: Joi.object({
            id: Joi.string()
                .required()
                .messages({
                    "any.required": "product id is required",
                    "string.empty": "product id cannot be empty",
                })
        }),
    },
};