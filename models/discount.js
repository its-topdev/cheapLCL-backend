"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  discount.init(
    {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      fixedDiscount: DataTypes.FLOAT,
      weeklyDiscount: DataTypes.FLOAT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "discount",
      paranoid: true,
    }
  );
  return discount;
};
