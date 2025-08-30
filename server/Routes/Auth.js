import express from "express";
import { validateSchema } from "../Middleware/CommonMiddleware.js";
import {  loginSchema, userRoleSchema } from "../Validators/AuthValidators.js";
import {  login, requestUser, getUserRoles, createUserRole, updateUserRole, deleteUserRole, updateUserDetails, getPermissions } from "../Controller/AuthController.js";

import { PERMISSIONS } from "../Constants/permissions.js";  
import { verifyPermissions, verifyToken } from "../Middleware/AuthMiddleWare.js";
const router = express.Router();


router.post("/login", validateSchema(loginSchema),login);
router.get('/request-user',verifyToken,requestUser);
router.get('/user-roles',verifyToken,verifyPermissions(PERMISSIONS.USER_ROLE.user_role_read),getUserRoles);
router.post('/user-roles',verifyToken,verifyPermissions(PERMISSIONS.USER_ROLE.user_role_create),validateSchema(userRoleSchema),createUserRole);
router.put('/user-roles/:id',verifyToken,verifyPermissions(PERMISSIONS.USER_ROLE.user_role_update),validateSchema(userRoleSchema),updateUserRole);
router.delete('/user-roles/:id',verifyToken,verifyPermissions(PERMISSIONS.USER_ROLE.user_role_delete),deleteUserRole);
router.put('/user-details/:userId',verifyToken,verifyPermissions(PERMISSIONS.USER.user_update),updateUserDetails);
router.get('/get-permissions',verifyToken,getPermissions);
export default router;