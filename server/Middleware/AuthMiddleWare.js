import { verifyToken } from "../Utils/AuthUtils.js";
import { User } from "../Models/UserSchema.js";
export const verifyTokenMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = await verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }else{
        let user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }else{
            req.user = user;
            req.token = token;
            next();
        }
    }
}

export const verifyPermissions=(req,res,next,permission)=>{
    if(req.user.permissions.includes(permission)){
        next();
    }else{
        return res.status(403).json({ message: "Forbidden" });
    }
}

