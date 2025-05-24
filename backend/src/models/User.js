const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100],
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 5,
      max: 12
    }
  },
  gender: {
    type: DataTypes.ENUM('boy', 'girl'),
    allowNull: false,
    validate: {
      isIn: [['boy', 'girl']]
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: function() {
      return this.gender === 'boy' ? '/avatars/boy-avatar.svg' : '/avatars/girl-avatar.svg';
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: {}
    }
  }
});

// Instance method to validate password
User.prototype.validatePassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Password validation error:', error);
    return false;
  }
};

// Static method to authenticate user
User.authenticate = async function(username, password) {
  try {
    const user = await this.scope('withPassword').findOne({ 
      where: { username, isActive: true } 
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return { success: false, message: 'Invalid password' };
    }

    // Remove password from response
    const userJson = user.toJSON();
    delete userJson.password;

    return { success: true, user: userJson };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error; // Let the route handler deal with the error
  }
};

module.exports = User; 