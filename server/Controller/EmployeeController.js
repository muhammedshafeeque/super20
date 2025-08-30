import { Profile, UserRole } from "../Models/UserSchema.js";
import { generateRandomString, queryGen } from "../Utils/utils.js";
import { User } from "../Models/UserSchema.js";

export const createEmployee = async (req, res, next) => {
    try {
        let email = req.body.email;
        let emailExists = await User.findOne({email:email});
        if(emailExists){
            return res.status(400).json({message:"Email already exists"});
        }
        let userRole = await UserRole.findOne({name:"employee"});
        if(!userRole){
            return res.status(400).json({message:"User role not found"});
        }
        let phoneExists = await Profile.findOne({"user.phone":req.body.phone});
        if(phoneExists){
            return res.status(400).json({message:"Phone number already exists"});
        }
        let password = await generateRandomString(10);
        let user = await User.create({
            email:email,
            password:password,
            permissions:userRole.permissions,
        });
        const profile = await Profile.create({
            user:user._id,
            name:req.body.name,
            age:req.body.age,
            gender:req.body.gender,
            userType:"employee",
            status:"active",
            dateOfBirth:req.body.dateOfBirth,
            dateOfJoining:req.body.dateOfJoining,
            userRole:userRole._id,
            educationalQualifications:req.body.educationalQualifications || [],
        });
  
        res.status(200).json({profile,message:"Employee created successfully"});
    } catch (error) {
        next(error);
    }
};

export const getEmployees = async (req, res, next) => {
    try {
        let limit=req.query.limit || 10;
        let skip=req.query.skip || 0;
        
        delete req.query.limit;
        delete req.query.skip;
        
        let query=await queryGen(req.query);
        query.userType= {$in: ["employee", "admin"]};
       
        const employees = await Profile.find(query).populate("user").populate("userRole").limit(limit).skip(skip);
        let count = await Profile.countDocuments(query);

        let result=await Promise.all(employees.map(async employee=>{
            const employeeObj = employee.toObject();
            return {
                ...employeeObj,
                user: {
                    _id: employeeObj.user._id,
                    name: employeeObj.user.name,
                    email: employeeObj.user.email,
                    permissions: employeeObj.user.permissions
                },
                userRoleName: employeeObj.userRole.name,
                userRoleCode: employeeObj.userRole.code,
                userRolePermissions: employeeObj.userRole.permissions,
                userPermissions: employeeObj.user.permissions,
                userPermissionCount: employeeObj.user.permissions.length,
                userRolePermissionCount: employeeObj.userRole.permissions.length
            }
        }))
        res.status(200).json({result:result,count:count});
    } catch (error) {
        next(error);
    }
};

export const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await User.findById(req.params.id).populate("profile");
        res.status(200).json({employee,message:"Employee fetched successfully"});
    } catch (error) {
        next(error);
    }
};

export const updateEmployee = async (req, res, next) => {
    try {
        const employee = await User.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate("profile");
        res.status(200).json({employee,message:"Employee updated successfully"});
    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Profile.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Employee deleted successfully"});
    } catch (error) {
        next(error);
    }
};