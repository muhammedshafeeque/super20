import express from "express";
import { createInstitution, createQualification, getQualificationTypes,getQualification,getInstitution,getInstitutions,updateQualification,updateInstitution,deleteQualification,deleteInstitution,getQualifications} from "../Controller/CoreController.js";
import { verifyPermissions } from "../Middleware/AuthMiddleWare.js";
import { PERMISSIONS } from "../Constants/permissions.js";
import { createQualificationSchema, createInstitutionSchema } from "../Validators/CoreValidator.js";
import { validateSchema } from "../Middleware/CommonMiddleware.js";

const router = express.Router();
router.get("/qualification-types", verifyPermissions(PERMISSIONS.QUALIFICATION_TYPES.qualification_types_read), getQualificationTypes);
router.post("/qualification",verifyPermissions(PERMISSIONS.QUALIFICATION.qualification_create),validateSchema(createQualificationSchema),createQualification)
router.get("/qualification/:id",verifyPermissions(PERMISSIONS.QUALIFICATION.qualification_read),getQualification)
router.put("/qualification/:id",verifyPermissions(PERMISSIONS.QUALIFICATION.qualification_update),validateSchema(createQualificationSchema),updateQualification)
router.delete("/qualification/:id",verifyPermissions(PERMISSIONS.QUALIFICATION.qualification_delete),deleteQualification)
router.get('/qualifications', verifyPermissions(PERMISSIONS.QUALIFICATION.qualification_read), getQualifications);
router.get("/institution/:id",verifyPermissions(PERMISSIONS.INSTITUTION.institution_read),getInstitution)
router.put("/institution/:id",verifyPermissions(PERMISSIONS.INSTITUTION.institution_update),validateSchema(createInstitutionSchema),updateInstitution)
router.delete("/institution/:id",verifyPermissions(PERMISSIONS.INSTITUTION.institution_delete),deleteInstitution)
router.get('/institutions', verifyPermissions(PERMISSIONS.INSTITUTION.institution_read), getInstitutions);
router.post("/institution",verifyPermissions(PERMISSIONS.INSTITUTION.institution_create),validateSchema(createInstitutionSchema),createInstitution)
export default router;