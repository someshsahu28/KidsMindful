const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const MoodEntry = sequelize.define('MoodEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

// Define associations
MoodEntry.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(MoodEntry, { foreignKey: 'userId' });

module.exports = MoodEntry; 