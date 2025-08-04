import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Profile } from "../Models/UserSchema.js";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = async (userId) => {
    return await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "No token provided" });
        }
        
        const token = authHeader.split(" ")[1];
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        
        let profile = await Profile.findOne({ user: decoded.userId });
        req.profile = profile;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export const verifyUserPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (req.profile && req.profile.userRole && req.profile.userRole.permissions && req.profile.userRole.permissions.includes(permission)) {
                next();
            } else {
                res.status(403).json({ error: "Unauthorized - Insufficient permissions" });
            }
        } catch (error) {
            res.status(403).json({ error: "Unauthorized - Permission verification failed" });
        }
    };
};