const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class price_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      price_history.belongsTo(models.price, {
        foreignKey: 'priceId',
      });
    }
  }
  price_history.init(
    {
      priceFirst: DataTypes.FLOAT,
      priceSecond: DataTypes.FLOAT,
      priceThird: DataTypes.FLOAT,
      priceFourth: DataTypes.FLOAT,
      priceDate: DataTypes.FLOAT,
      createdById: DataTypes.INTEGER,
      updatedById: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'price_history',
      paranoid: true,
    },
  );
  return price_history;
};
