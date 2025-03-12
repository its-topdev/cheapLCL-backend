const { Model } = require('sequelize');
const jwt = require('jsonwebtoken');
const { config } = require('../config/secret');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsTo(models.userStatus, { foreignKey: 'user_status' });
    }
  }
  user.prototype.createToken = async function (expireIn = '180mins') {
    const token = jwt.sign(
      { id: this.id, role: this.role },
      config.tokenSecret,
      {
        expiresIn: expireIn,
      },
    );
    return token;
  };

  user.isEmailExist = async function (email) {
    const userObj = await user.findOne({
      where: {
        email,
      },
    });
    return userObj;
  };

  user.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      company: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: DataTypes.STRING,
      user_status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'user',
      paranoid: true,
    },
  );
  return user;
};
