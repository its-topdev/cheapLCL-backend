"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class charge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      charge.belongsTo(models.chargeType, { foreignKey: "typeId" });
      charge.belongsToMany(models.bookRequest, {
        through: models.bookCharge,
        foreignKey: "chargeId",
        otherKey: "bookId",
      });
    }
  }
  charge.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.FLOAT,
      minPrice: DataTypes.FLOAT,
      createdById: DataTypes.INTEGER,
      updatedById: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "charge",
      paranoid: true,
    }
  );
  return charge;
};
