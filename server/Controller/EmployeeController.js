import { Profile, UserRole } from "../Models/UserSchema.js";
import { generateRandomString, queryGen } from "../Utils/utils.js";
import { User } from "../Models/UserSchema.js";
import { COLLECTIONS } from "../Constants/Constants.js";

export const createEmployee = async (req, res, next) => {
    try {
        const { email, phone, userRole: userRoleId } = req.body;
        const [emailExists, userRole, phoneExists] = await Promise.all([
            User.findOne({ email }),
            UserRole.findById(userRoleId),
            Profile.findOne({ "user.phone": phone })
        ]);
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }
        
        if (!userRole) {
            return res.status(400).json({ message: "User role not found" });
        }
        
        if (phoneExists) {
            return res.status(400).json({ message: "Phone number already exists" });
        }
        const [password] = await Promise.all([
            generateRandomString(10)
        ]);
        
        const user = await User.create({
            name: req.body.name,
            email,
            password,
            permissions: userRole.permissions,
        });
        
        const calculateAge = (dateOfBirth) => {
            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        const profile = await Profile.create({
            user: user._id,
            name: req.body.name,
            age: calculateAge(req.body.dateOfBirth),
            gender: req.body.gender,
            userType: "employee",
            status: "active",
            dateOfBirth: req.body.dateOfBirth,
            dateOfJoining: req.body.dateOfJoining,
            userRole: userRole._id,
            educationalQualifications: req.body.educationalQualifications || [],
        });
  
        res.status(200).json({ profile, message: "Employee created successfully" });
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
       
        const employees = await Profile.find(query)
            .populate("user")
            .populate("userRole")
            .populate({
                path: "educationalQualifications.qualification",
                model: COLLECTIONS.QUALIFICATION
            })
            .limit(limit)
            .skip(skip);
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
        const employee = await Profile.findById(req.params.id)
            .populate("user")
            .populate("userRole")
            .populate({
                path: "educationalQualifications.qualification",
                model: "qualifications"
            });
        
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        res.status(200).json({ employee, message: "Employee fetched successfully" });
    } catch (error) {
        next(error);
    }
};

export const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Calculate age from date of birth if provided
        if (updateData.dateOfBirth) {
            const calculateAge = (dateOfBirth) => {
                const today = new Date();
                const birthDate = new Date(dateOfBirth);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            };
            updateData.age = calculateAge(updateData.dateOfBirth);
        }
        
        const employee = await Profile.findByIdAndUpdate(id, updateData, { new: true })
            .populate("user")
            .populate("userRole")
            .populate({
                path: "educationalQualifications.qualification",
                model: "qualifications"
            });
        
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        res.status(200).json({ employee, message: "Employee updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const updateEmployeePermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "Employee not found" });
        }
        user.permissions = permissions;
        await user.save();
        
        res.status(200).json({ 
            message: "Employee permissions updated successfully",
            permissions: user.permissions
        });
    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (req, res, next) => {
    try {
        await Profile.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Employee deleted successfully"});
    } catch (error) {
        next(error);
    }
};