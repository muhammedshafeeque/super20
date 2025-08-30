import Joi from "joi";

export const createEmployeeSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    dateOfJoining: Joi.date().required(),
    userRole: Joi.string().required(),
    gender: Joi.string().required().valid("male", "female", "other"),
    educationalQualifications: Joi.array().items(
      Joi.object({
        qualification: Joi.string().required(),
        yearOfPassing: Joi.number().required(),
        percentage: Joi.number().required(),
        institution: Joi.string().required(),
      })
    ),
  }),
};
