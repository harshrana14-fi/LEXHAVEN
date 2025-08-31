// lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User, { IUser } from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function findUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  const userDoc = await User.findOne({ email }).lean();
  return userDoc as IUser | null;
}

export async function createUser(userData: any): Promise<IUser> {
  await connectDB();
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const user = new User({
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    profile: userData.profile,
    isVerified: false,
  });

  const savedUser = await user.save();
  return savedUser as IUser;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function findUserById(userId: string): Promise<IUser | null> {
  await connectDB();
  const userDoc = await User.findById(userId).select('-password').lean();
  return userDoc as IUser | null;
}