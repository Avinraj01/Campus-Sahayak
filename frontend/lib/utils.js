import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Environment variables
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/campus_management';
const DB_NAME = process.env.DB_NAME || 'campus_management';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

let client = null;
let db = null;

// Initialize MongoDB connection
export async function initDB() {
  if (db) return db;
  
  try {
    client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

// Close MongoDB connection
export async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

// JWT functions
export function createAccessToken(data) {
  return jwt.sign(data, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Password functions
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Helper functions
export function prepareForMongo(data) {
  if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Date) {
        result[key] = value.toISOString();
      } else if (typeof value === 'object' && value !== null) {
        result[key] = prepareForMongo(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return data;
}

// Generate IDs
export function generateEnrollmentNo() {
  return `ENR${new Date().getFullYear()}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
}

export function generateTeacherId() {
  return `TCH${new Date().getFullYear()}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
}

// Generate UUID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}