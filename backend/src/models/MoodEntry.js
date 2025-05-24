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
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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

MoodEntry.belongsTo(User);

module.exports = MoodEntry; 