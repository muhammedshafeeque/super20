import { User, Profile, UserRole } from "../Models/UserSchema.js"
import bcrypt from "bcrypt"
import readline from 'readline'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { PERMISSIONS } from "../Constants/permissions.js"

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/super20');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export const createAdmin = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    console.log('=== Create Admin User ===\n');
    
    // Get user input
    const name = await question('Enter admin name (default: Admin): ') || 'Admin';
    const email = await question('Enter admin email (default: admin@super20.com): ') || 'admin@super20.com';
    const password = await question('Enter admin password (default: admin123): ') || 'admin123';
    

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email });
    if (existingAdmin) {
      console.log(`\n❌ Admin with email ${email} already exists!`);
      rl.close();
      return;
    }
    
    // Create or find admin role
    let userRole = await UserRole.findOne({ name: 'admin' });
    
    // Get all permissions from all modules
    const allPermissions = Object.values(PERMISSIONS).flatMap(modulePermissions => 
      Object.values(modulePermissions)
    );
    
    if (!userRole) {
      userRole = await UserRole.create({
        name: 'admin',
        permissions: allPermissions,
        code: 'super_admin',
        description: 'Super Admin role with all permissions'
      });
      console.log('✅ Admin role created with all permissions');
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      permissions: allPermissions
    });
    
    // Create admin profile with required fields
    await Profile.create({
      user: admin._id,
      name: name,
      age: 25,
      gender: 'Not specified',
      profilePicture: 'https://via.placeholder.com/150x150/8b5cf6/ffffff?text=Admin',
      status: 'active',
      userType: 'admin',
      isVerified: true,
      isActive: true,
      dateOfBirth: new Date('1990-01-01'),
      dateOfJoining: new Date(),
      educationalQualifications: [],
      userRole: userRole._id
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Role: admin`);
    console.log(`Permissions: ${userRole.permissions.length} permissions granted`);
    
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
}

createAdmin();