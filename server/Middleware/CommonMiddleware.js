import rateLimit from "express-rate-limit";
import Joi from "joi";
export const errorHandler = (err, req, res, next) => {
    if(err.status){
        return res.status(err.status).json({ message: err.message });
    }else{
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
};
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export  const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}

export const requestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests, please try again later.",
});


export const validateSchema = (schema) => {
    
    return (req, res, next) => {
        // Debug: Check if body is being parsed
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: "Request body is empty or not properly formatted. Please ensure Content-Type is application/json and body is valid JSON." 
            });
        }
        
        // Validate only the body part of the schema
        const { error } = schema.validate({ body: req.body });
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        next();
    }
}