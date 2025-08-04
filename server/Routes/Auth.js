import express from "express";
import { validateSchema } from "../Middleware/CommonMiddleware.js";
import { registerSchema, loginSchema, userRoleSchema } from "../Validators/AuthValidators.js";
import { register, login, requestUser, getUserRoles, createUserRole, updateUserRole, deleteUserRole, updateUserDetails } from "../Controller/AuthController.js";
import { verifyToken, verifyUserPermission } from "../Utils/AuthUtils.js";
import { PERMISSIONS } from "../Constants/permissions.js";  
const router = express.Router();

router.post("/register",verifyToken,verifyUserPermission(PERMISSIONS.USER.user_create),validateSchema(registerSchema),register);
router.post("/login", validateSchema(loginSchema),login);
router.get('/request-user',verifyToken,requestUser);
router.get('/user-roles',verifyToken,verifyUserPermission(PERMISSIONS.USER_ROLE.user_role_read),getUserRoles);
router.post('/user-roles',verifyToken,verifyUserPermission(PERMISSIONS.USER_ROLE.user_role_create),validateSchema(userRoleSchema),createUserRole);
router.put('/user-roles/:id',verifyToken,verifyUserPermission(PERMISSIONS.USER_ROLE.user_role_update),validateSchema(userRoleSchema),updateUserRole);
router.delete('/user-roles/:id',verifyToken,verifyUserPermission(PERMISSIONS.USER_ROLE.user_role_delete),deleteUserRole);   
router.put('/user-details/:userId',verifyToken,verifyUserPermission(PERMISSIONS.USER.user_update),updateUserDetails);
export default router;