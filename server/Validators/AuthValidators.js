import Joi from "joi";
import { USER_TYPES, GENDER, QUALIFICATION_TYPES } from "../Constants/Constants.js";



export const loginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),
    }),
});

export const userRoleSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
        code: Joi.string().required().messages({
            'string.empty': 'Code is required',
            'any.required': 'Code is required'
        }),
        description: Joi.string().messages({
            'string.empty': 'Description is required'
        }),
        permissions: Joi.array().items(Joi.string()).messages({
            'array.base': 'Permissions must be an array',
            'any.required': 'Permissions are required'
        }),
    }),
});

export const createUserSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required',
        }),
        userType: Joi.string().valid(...USER_TYPES).required().messages({
            'any.only': `User type must be one of the following: ${USER_TYPES.join(', ')}`,
            'any.required': 'User type is required'
        }),
        gender: Joi.string().valid(...GENDER).required().messages({
            'any.only': `Gender must be one of the following: ${GENDER.join(', ')}`,
            'any.required': 'Gender is required'
        }),
        UserRole: Joi.string().required().messages({
            'string.empty': 'User role is required',
            'any.required': 'User role is required'
        }),
    }),
});
export const registerStudentsSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
        dateOfBirth: Joi.date().required().messages({
            'date.base': 'Date of birth must be a valid date',
            'any.required': 'Date of birth is required'
        }),
        gender: Joi.string().valid(...GENDER).required().messages({
            'any.only': `Gender must be one of the following: ${GENDER.join(', ')}`,
            'any.required': 'Gender is required'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        phone: Joi.string().required().messages({
            'string.empty': 'Phone number is required',
            'any.required': 'Phone number is required'
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Address is required',
            'any.required': 'Address is required'
        }),
        qualifications: Joi.array().items(Joi.string().valid(...QUALIFICATION_TYPES)).required().messages({
            'array.base': 'Qualifications must be an array',
            'any.required': 'Qualifications are required'
        }),
    }),
});