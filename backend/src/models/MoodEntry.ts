import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

interface MoodEntryAttributes {
  id: string;
  userId: string;
  mood: string;
  note: string;
  date: Date;
}

interface MoodEntryCreationAttributes extends Omit<MoodEntryAttributes, 'id' | 'date'> {}

class MoodEntry extends Model<MoodEntryAttributes, MoodEntryCreationAttributes> {
  public id!: string;
  public userId!: string;
  public mood!: string;
  public note!: string;
  public date!: Date;
}

MoodEntry.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    mood: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'MoodEntry',
  }
);

// Define associations
MoodEntry.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(MoodEntry, { foreignKey: 'userId' });

export default MoodEntry; 