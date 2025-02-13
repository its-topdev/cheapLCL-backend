'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  verification.init({
    code: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'verification',
  });
  return verification;
};