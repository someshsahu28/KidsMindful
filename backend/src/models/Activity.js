import prisma from '../config/database.js';

class ActivityService {
  // Create a new activity
  static async create(activityData) {
    try {
      return await prisma.activity.create({
        data: activityData
      });
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  // Find activity by ID
  static async findById(id) {
    try {
      return await prisma.activity.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error finding activity by ID:', error);
      throw error;
    }
  }

  // Get all activities
  static async findAll() {
    try {
      return await prisma.activity.findMany({
        where: { isActive: true },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error finding all activities:', error);
      throw error;
    }
  }

  // Get activities by category
  static async findByCategory(category) {
    try {
      return await prisma.activity.findMany({
        where: {
          category,
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error finding activities by category:', error);
      throw error;
    }
  }

  // Get activities by target mood
  static async findByTargetMood(mood) {
    try {
      return await prisma.activity.findMany({
        where: {
          targetMoods: {
            has: mood
          },
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error finding activities by target mood:', error);
      throw error;
    }
  }

  // Get activities by recommended age
  static async findByRecommendedAge(age) {
    try {
      return await prisma.activity.findMany({
        where: {
          recommendedAge: age,
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error finding activities by recommended age:', error);
      throw error;
    }
  }

  // Update activity
  static async update(id, updateData) {
    try {
      return await prisma.activity.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  // Delete activity
  static async delete(id) {
    try {
      return await prisma.activity.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  // Soft delete activity (set isActive to false)
  static async softDelete(id) {
    try {
      return await prisma.activity.update({
        where: { id },
        data: { isActive: false }
      });
    } catch (error) {
      console.error('Error soft deleting activity:', error);
      throw error;
    }
  }

  // Increment likes for an activity
  static async incrementLikes(id) {
    try {
      return await prisma.activity.update({
        where: { id },
        data: {
          likes: {
            increment: 1
          }
        }
      });
    } catch (error) {
      console.error('Error incrementing likes:', error);
      throw error;
    }
  }

  // Get popular activities (by likes)
  static async getPopularActivities(limit = 10) {
    try {
      return await prisma.activity.findMany({
        where: { isActive: true },
        orderBy: {
          likes: 'desc'
        },
        take: limit
      });
    } catch (error) {
      console.error('Error getting popular activities:', error);
      throw error;
    }
  }

  // Search activities by title or description
  static async search(searchTerm) {
    try {
      return await prisma.activity.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          ],
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error searching activities:', error);
      throw error;
    }
  }
}

export default ActivityService; 