import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database';

interface UserAttributes {
  id: string;
  username: string;
  password: string;
  name: string;
  age: number;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string;
  public username!: string;
  public password!: string;
  public name!: string;
  public age!: number;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user: User) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

export default User; 