import Joi from "joi";

export const createQualificationSchema = Joi.object({
   body:Joi.object({
    qualificationType:Joi.string().required(),
    course:Joi.string().required(),
    specialization:Joi.string().required(),
   })
})

export const createInstitutionSchema = Joi.object({
    body:Joi.object({
        name:Joi.string().required(),
        location:Joi.string().required(),
    })
})