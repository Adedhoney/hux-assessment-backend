import Joi from 'joi';

export const SignUpSchema = Joi.object({
    email: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
});
export const LogInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
export const UpdatePassWordSchema = Joi.object({
    password: Joi.string().required(),
});
export const CreateContactSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().optional(),
});
export const UpdateContactSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phone: Joi.string().optional(),
    email: Joi.string().optional(),
});
