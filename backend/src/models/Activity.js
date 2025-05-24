import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetMoods: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  recommendedAge: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Activity; 