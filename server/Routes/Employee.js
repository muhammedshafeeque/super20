import express from "express";
const router = express.Router();
import { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee, updateEmployeePermissions } from "../Controller/EmployeeController.js";
import { verifyPermissions } from "../Middleware/AuthMiddleWare.js";
import { PERMISSIONS } from "../Constants/permissions.js";
import { validateSchema } from "../Middleware/CommonMiddleware.js";
import { createEmployeeSchema } from "../Validators/employeeValidation.js";

router.post("/",verifyPermissions(PERMISSIONS.EMPLOYEE.employee_create), validateSchema(createEmployeeSchema), createEmployee);
router.get("/",verifyPermissions(PERMISSIONS.EMPLOYEE.employee_read), getEmployees);
router.get("/:id",verifyPermissions(PERMISSIONS.EMPLOYEE.employee_read), getEmployeeById);
router.put("/:id/permissions",verifyPermissions(PERMISSIONS.EMPLOYEE.employee_update), updateEmployeePermissions);
router.put("/:id",verifyPermissions(PERMISSIONS.EMPLOYEE.employee_update), validateSchema(createEmployeeSchema), updateEmployee);
router.delete("/:id",verifyPermissions(PERMISSIONS.EMPLOYEE.employee_delete), deleteEmployee);  

export default router;