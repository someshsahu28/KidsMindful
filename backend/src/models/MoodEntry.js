import prisma from '../config/database.js';

class MoodEntryService {
  // Create a new mood entry
  static async create(moodData) {
    try {
      return await prisma.moodEntry.create({
        data: moodData,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating mood entry:', error);
      throw error;
    }
  }

  // Find mood entry by ID
  static async findById(id) {
    try {
      return await prisma.moodEntry.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error finding mood entry by ID:', error);
      throw error;
    }
  }

  // Get all mood entries for a user
  static async findByUserId(userId) {
    try {
      return await prisma.moodEntry.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });
    } catch (error) {
      console.error('Error finding mood entries by user ID:', error);
      throw error;
    }
  }

  // Get all mood entries
  static async findAll() {
    try {
      return await prisma.moodEntry.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });
    } catch (error) {
      console.error('Error finding all mood entries:', error);
      throw error;
    }
  }

  // Update mood entry
  static async update(id, updateData) {
    try {
      return await prisma.moodEntry.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error updating mood entry:', error);
      throw error;
    }
  }

  // Delete mood entry
  static async delete(id) {
    try {
      return await prisma.moodEntry.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  }

  // Get mood entries by date range
  static async findByDateRange(userId, startDate, endDate) {
    try {
      return await prisma.moodEntry.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });
    } catch (error) {
      console.error('Error finding mood entries by date range:', error);
      throw error;
    }
  }

  // Get mood statistics for a user
  static async getMoodStats(userId) {
    try {
      const entries = await prisma.moodEntry.findMany({
        where: { userId },
        select: {
          mood: true,
          date: true
        },
        orderBy: {
          date: 'desc'
        }
      });

      // Group by mood and count
      const moodCounts = entries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {});

      return {
        totalEntries: entries.length,
        moodCounts,
        recentEntries: entries.slice(0, 10) // Last 10 entries
      };
    } catch (error) {
      console.error('Error getting mood statistics:', error);
      throw error;
    }
  }
}

export default MoodEntryService; 