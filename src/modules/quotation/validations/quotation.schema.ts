import Joi from "joi";

export const createQuotationSchema = Joi.object({
  clientName: Joi.string().required().min(3).max(100).messages({
    "string.empty": "El nombre del cliente es requerido",
    "string.min": "El nombre del cliente debe tener al menos 3 caracteres",
    "string.max": "El nombre del cliente no puede exceder los 100 caracteres",
    "any.required": "El nombre del cliente es requerido",
  }),
  description: Joi.string().required().min(10).max(500).messages({
    "string.empty": "La descripción es requerida",
    "string.min": "La descripción debe tener al menos 10 caracteres",
    "string.max": "La descripción no puede exceder los 500 caracteres",
    "any.required": "La descripción es requerida",
  }),
  amount: Joi.number().required().min(0).precision(2).messages({
    "number.base": "El monto debe ser un número",
    "number.min": "El monto no puede ser negativo",
    "any.required": "El monto es requerido",
  }),
  currency: Joi.string().required().length(3).uppercase().messages({
    "string.empty": "La moneda es requerida",
    "string.length": "La moneda debe tener 3 caracteres",
    "string.uppercase": "La moneda debe estar en mayúsculas",
    "any.required": "La moneda es requerida",
  }),
});

export const updateQuotationSchema = Joi.object({
  clientName: Joi.string().min(3).max(100).messages({
    "string.min": "El nombre del cliente debe tener al menos 3 caracteres",
    "string.max": "El nombre del cliente no puede exceder los 100 caracteres",
  }),
  description: Joi.string().min(10).max(500).messages({
    "string.min": "La descripción debe tener al menos 10 caracteres",
    "string.max": "La descripción no puede exceder los 500 caracteres",
  }),
  amount: Joi.number().min(0).precision(2).messages({
    "number.base": "El monto debe ser un número",
    "number.min": "El monto no puede ser negativo",
  }),
  currency: Joi.string().length(3).uppercase().messages({
    "string.length": "La moneda debe tener 3 caracteres",
    "string.uppercase": "La moneda debe estar en mayúsculas",
  }),
  status: Joi.string().valid("pending", "approved", "rejected").messages({
    "any.only": "El estado debe ser uno de: pending, approved, rejected",
  }),
})
  .min(1)
  .messages({
    "object.min": "Debe proporcionar al menos un campo para actualizar",
  });
