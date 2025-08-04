import Joi from "joi";
import { USER_TYPES, GENDER } from "../Constants/Constants.js";

export const registerSchema = Joi.object({
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
            'any.required': 'Password is required'
        }),
        age: Joi.number().required().messages({
            'number.base': 'Age must be a valid number',
            'any.required': 'Age is required'
        }),
        gender: Joi.string().required().valid(...GENDER).messages({
            'any.only': `Gender must be one of: ${GENDER.join(', ')}`,
            'any.required': 'Gender is required'
        }),
        profilePicture: Joi.string().required().messages({
            'string.empty': 'Profile picture is required',
            'any.required': 'Profile picture is required'
        }),
        status: Joi.string().required().messages({
            'string.empty': 'Status is required',
            'any.required': 'Status is required'
        }),
        userType: Joi.string().required().valid(...USER_TYPES).messages({
            'any.only': `User type must be one of: ${USER_TYPES.join(', ')}`,
            'any.required': 'User type is required'
        }),
        dateOfBirth: Joi.date().required().messages({
            'date.base': 'Date of birth must be a valid date',
            'any.required': 'Date of birth is required'
        }),
        dateOfJoining: Joi.date().required().messages({
            'date.base': 'Date of joining must be a valid date',
            'any.required': 'Date of joining is required'
        }),
        educationalQualifications: Joi.array().items(Joi.object({
            qualification: Joi.string().required().messages({
                'string.empty': 'Qualification is required',
                'any.required': 'Qualification is required'
            }),
            institution: Joi.string().required().messages({
                'string.empty': 'Institution is required',
                'any.required': 'Institution is required'
            }),
            yearOfPassing: Joi.number().required().messages({
                'number.base': 'Year of passing must be a valid number',
                'any.required': 'Year of passing is required'
            }),
            percentage: Joi.number().required().messages({
                'number.base': 'Percentage must be a valid number',
                'any.required': 'Percentage is required'
            }),
        })),
        userRole:Joi.string()
    }),
});

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