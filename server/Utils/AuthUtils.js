import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = async (userId) => {
    return await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};



export const verifyJWTToken = async (token) => { 
    try {
        return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error("JWT verification failed:", error);
        return { error: error.name, message: error.message };
    }
}