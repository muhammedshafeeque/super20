import mongoose, { Mongoose } from "mongoose";
import { COLLECTIONS, USER_TYPES } from "../Constants/Constants.js";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissions: { type: [String]},
});

export const User = mongoose.model(COLLECTIONS.USER, userSchema);


const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTIONS.USER, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    profilePicture: { type: String },
    status: { type: String, required: true },
    userType: { type: String, required: true ,enum: USER_TYPES},
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    educationalQualifications:[
        {
            qualification: { type: String, required: true },
            institution: { type: String, required: true },
            yearOfPassing: { type: Number, required: true },
            percentage: { type: Number, required: true },
        }
    ],
    dateOfBirth: { type: Date, required: true },
    dateOfJoining: { type: Date, required: true },
    userRole:{type:mongoose.Schema.Types.ObjectId,ref:COLLECTIONS.USER_ROLE}
},
{
    timestamps: true,
});

export const Profile = mongoose.model(COLLECTIONS.PROFILE, profileSchema);


const userRolSchema=new mongoose.Schema({
    name:{type:String},
    permissions:{ type: [String]},
    code:{type:String,required:true,unique:true},
    description:{type:String},
})

export const UserRole=mongoose.model(COLLECTIONS.USER_ROLE,userRolSchema)