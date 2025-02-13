'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      price.hasMany(models.bookRequest);
      price.belongsTo(models.carrier, { foreignKey: 'carrierId', });
      price.belongsTo(models.vessel, { foreignKey: 'vesselId', });
      price.belongsTo(models.port, { foreignKey: 'pol', as: 'polObj' });
      price.belongsTo(models.port, { foreignKey: 'pod', as: 'podObj' });

    }


  }

  price.init({
    pol: DataTypes.INTEGER,
    pod: DataTypes.INTEGER,
    carrierId: DataTypes.INTEGER,
    vesselId: { type: DataTypes.INTEGER, unique: true },
    voyage: { type: DataTypes.STRING, unique: true },
    departureDate: DataTypes.DATE,
    arrivalDate: DataTypes.DATE,
    priceFirst: DataTypes.FLOAT,
    priceSecond: DataTypes.FLOAT,
    priceThird: DataTypes.FLOAT,
    priceFourth: DataTypes.FLOAT,
    priceDate: DataTypes.FLOAT,
    createdById: DataTypes.INTEGER,
    updatedById: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'price',
    paranoid: true,
  });
  return price;
};