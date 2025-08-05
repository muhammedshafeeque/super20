import { User, UserRole } from "../Models/UserSchema.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../Utils/AuthUtils.js";
import { Profile } from "../Models/UserSchema.js";
import { queryGen } from "../Utils/utils.js";
import { PERMISSIONS } from "../Constants/permissions.js";
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      profilePicture,
      status,
      userType,
      dateOfBirth,
      dateOfJoining,
      educationalQualifications,
    } = req.body;
    let userExist=await User.findOne({email:email})
    if(userExist){
        next({status:400,message:"Email already exist"})
    }else{
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });
    let profileData={
      user:user._id,
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      profilePicture,
      status,
      userType,
      dateOfBirth,
      dateOfJoining,
      educationalQualifications,
    }
    if(req.body.userRole){
      profileData.userRole=req.body.userRole
      let userRole=await UserRole.findById(req.body.userRole)
      await User.findByIdAndUpdate(user._id,{
        $set:{
          permissions:userRole.permissions
        }
      })
    }
    const profile = await Profile.create(profileData);
    res.status(201).json({ profile });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const profile=await Profile.findOne({user:user._id})
    const token = await generateToken(user._id);
    res.status(200).json({ token,profile });
  } catch (error) {
    next(error);
  }
};

export const requestUser = async (req, res, next) => {
  try {
    const profile = req.profile;
    res.status(200).json({ profile,token:req.token });
  } catch (error) {
    next(error);
  }
};

export const getUserRoles = async (req, res, next) => {
  try {
    let query = req.query;
    let keywords = await queryGen(query);
    const userRoles = await UserRole.find(keywords).limit(query.limit?query.limit:10).skip(query.skip?query.skip:0);
    res.status(200).json({results: userRoles });
  } catch (error) {
    next(error);
  }
};
export const createUserRole = async (req, res, next) => {
  try {
    let userRoleExist=await UserRole.findOne({code:req.body.code})
    if(userRoleExist){
      next({status:400,message:"User role already exist"})
    }else{
    const userRole = await UserRole.create(req.body);
    res.status(201).json({ userRole ,message:"User role created successfully"});
    }
  } catch (error) {
    next(error);
  }
};
export const updateUserRole = async (req, res, next) => {
  try {
    let userRole=await UserRole.findById(req.params.id)
    if(!userRole){
      next({status:404,message:"User role not found"})
    }else{
      let updatedUserRole=await UserRole.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json({ updatedUserRole ,message:"User role updated successfully"});
    }
  } catch (error) {
    next(error);
  }
};
export const deleteUserRole = async (req, res, next) => {
  try {
    let userRole=await UserRole.findById(req.params.id)
    if(!userRole){
      next({status:404,message:"User role not found"})
    }else{
      let deletedUserRole=await UserRole.findByIdAndDelete(req.params.id);
      res.status(200).json({ deletedUserRole ,message:"User role deleted successfully"});
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  try {
      if(req.body.password){
        req.body.password=await hashPassword(req.body.password)
      }
      if(req.body.userRole){
        let userRole=await UserRole.findById(req.body.userRole)
        if(!userRole){
          next({status:404,message:"User role not found"})
        }else{
          req.body.permissions=userRole.permissions
        }
      }
      
      let userData=await User.findById(req.params.userId)
      if(!userData){
        next({status:404,message:"User not found"})
      }else{
        let  profileData=await Profile.findOne({user:req.params.userId})
        
        if(req.body.name) profileData.name=req.body.name  , userData.name=req.body.name
        if(req.body.email) profileData.email=req.body.email , userData.email=req.body.email
        if(req.body.password) userData.password=req.body.password
        if(req.body.userRole) profileData.userRole=req.body.userRole , userData.userRole=req.body.userRole
        if(req.body.permissions) user.permissions=req.body.permissions
        if(req.body.age) profileData.age=req.body.age
        if(req.body.gender) profileData.gender=req.body.gender
        if(req.body.profilePicture) profileData.profilePicture=req.body.profilePicture
        if(req.body.status) profileData.status=req.body.status
        if(req.body.userType) profileData.userType=req.body.userType
        if(req.body.dateOfBirth) profileData.dateOfBirth=req.body.dateOfBirth
        if(req.body.dateOfJoining) profileData.dateOfJoining=req.body.dateOfJoining
        if(req.body.educationalQualifications) profileData.educationalQualifications=req.body.educationalQualifications

        let profile=await Profile.findByIdAndUpdate(req.params.userId,{$set:profileData})
        let user=await User.findByIdAndUpdate(req.params.userId,{$set:userData})
        res.status(200).json({ profile ,message:"User details updated successfully"});
      }

  } catch (error) {
    next(error);
  }
};

export const getPermissions = async (req, res, next) => {
  try {
 
    res.status(200).json( PERMISSIONS );
  } catch (error) {
    next(error);
  }
};