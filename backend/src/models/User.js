import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';

class UserService {
  // Create a new user
  static async create(userData) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          avatar: userData.avatar || (userData.gender === 'boy' ? '/avatars/boy-avatar.svg' : '/avatars/girl-avatar.svg')
        }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      return await prisma.user.findUnique({
        where: { username }
      });
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Find user by username with password (for authentication)
  static async findByUsernameWithPassword(username) {
    try {
      return await prisma.user.findUnique({
        where: { username, isActive: true }
      });
    } catch (error) {
      console.error('Error finding user with password:', error);
      throw error;
    }
  }

  // Update user
  static async update(id, updateData) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      return await prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          age: true,
          gender: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return users;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  // Validate password
  static async validatePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Password validation error:', error);
      return false;
    }
  }

  // Authenticate user
  static async authenticate(username, password) {
    try {
      const user = await this.findByUsernameWithPassword(username);

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const isValid = await this.validatePassword(password, user.password);
      if (!isValid) {
        return { success: false, message: 'Invalid password' };
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }
}

export default UserService; 