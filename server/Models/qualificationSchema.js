import mongoose from "mongoose";
import { COLLECTIONS, QUALIFICATION_TYPES } from "../Constants/Constants.js";

const qualificationSchema = new mongoose.Schema({
    qualificationType: { type: String, required: true, enum: QUALIFICATION_TYPES },
    course: { type: String, required: true },
    specialization: { type: String, required: true },
});

export const Qualification = mongoose.model(COLLECTIONS.QUALIFICATION, qualificationSchema);

const institutionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
});

export const Institution = mongoose.model(COLLECTIONS.INSTITUTION, institutionSchema);



