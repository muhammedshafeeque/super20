import { Institution, Qualification } from "../Models/qualificationSchema.js";
import { QUALIFICATION_TYPES } from "../Constants/Constants.js";
import { queryGen } from "../Utils/utils.js";

export const getQualificationTypes = (req, res) => {
    res.json(QUALIFICATION_TYPES);
};
export const createQualification = async (req, res,next) => {
    try {
        const { qualificationType, course, specialization } = req.body;
        const qualification = await Qualification.create({ qualificationType, course, specialization });
        res.json(qualification);
    } catch (error) {
        next(error);
    }
};
export const getQualification = async (req, res,next) => {
    try {
        const qualification = await Qualification.findById(req.params.id);
        res.json(qualification);
    } catch (error) {
        next(error);
    }
};
export const getQualifications = async (req, res,next) => {
    try {
        let limit=req.query.limit || 10;
        let skip=req.query.skip || 0;
        let query=await queryGen(req.query);
        const qualifications = await Qualification.find(query).skip(skip).limit(limit);
        let count=await Qualification.countDocuments(query);
        res.json({results:qualifications,count});
    } catch (error) {
        next(error);
    }
};
export const updateQualification = async (req, res,next) => {
    try {
        const qualification = await Qualification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(qualification);
    } catch (error) {
        next(error);
    }
};
export const deleteQualification = async (req, res,next) => {
    try {
        const qualification = await Qualification.findByIdAndDelete(req.params.id);
        res.json(qualification);
    } catch (error) {
        next(error);
    }
};
export const createInstitution = async (req, res,next) => {
    try {
        const { name, location } = req.body;
        const institution = await Institution.create({ name, location });
        res.json(institution);
    } catch (error) {
        next(error);
    }
};
export const getInstitution=async (req, res,next) => {
    try {
        const institution = await Institution.findById(req.params.id);
        res.json(institution);
    } catch (error) {
        next(error);
    }
};
export const getInstitutions=async (req, res,next) => {
    try {
        let limit=req.query.limit || 10;
        let skip=req.query.skip || 0;
        let query=await queryGen(req.query);
        const institution = await Institution.find(query).skip(skip).limit(limit);
        let count=await Institution.countDocuments(query);
        res.json({results:institution,count});
    } catch (error) {
        next(error);
    }
};
export const updateInstitution = async (req, res,next) => {
    try {
        const institution = await Institution.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(institution);
    } catch (error) {
        next(error);
    }
};
export const deleteInstitution = async (req, res,next) => {
    try {
        const institution = await Institution.findByIdAndDelete(req.params.id);
        res.json(institution);
    } catch (error) {
        next(error);
    }
};