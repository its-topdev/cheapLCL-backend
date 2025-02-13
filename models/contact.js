'use strict';
const {
  Model
} = require('sequelize');
const shipper = require('./shipper');
module.exports = (sequelize, DataTypes) => {
  class contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      contact.belongsTo(models.shipper, {
        foreignKey: "shipperId"
    });

    }
  }
  contact.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    createdById: DataTypes.INTEGER,
    updatedById: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'contact',
    paranoid: true
  });
  return contact;
};