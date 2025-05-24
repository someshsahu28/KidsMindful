const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mood = sequelize.define('Mood', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
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
  }
});

module.exports = Mood; 