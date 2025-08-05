
import { User } from "../Models/UserSchema.js";
import { verifyJWTToken } from "../Utils/AuthUtils.js";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is required" });
    }

    // Handle Bearer token format
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    
    const decoded = await verifyJWTToken(token);
    
    // Check if there was an error in JWT verification
    if (decoded && decoded.error) {
        if (decoded.error === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired. Please login again." });
        } else if (decoded.error === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        } else {
            return res.status(401).json({ message: "Token verification failed" });
        }
    }
    
    if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
    }
    
    let user = await User.findById(decoded.userId);
    
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    } else {
        req.user = user;
        req.token = token;
        next();
    }
}

export const verifyPermissions = (permission) => {
    return (req, res, next) => {
        if (req.user && req.user.permissions && req.user.permissions.includes(permission)) {
            next();
        } else {
            return res.status(403).json({ message: "Forbidden" });
        }
    };
}

