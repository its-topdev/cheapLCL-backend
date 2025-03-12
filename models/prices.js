const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class prices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      prices.belongsTo(models.port, { foreignKey: 'pol', as: 'polObj' });
      prices.belongsTo(models.port, { foreignKey: 'pod', as: 'podObj' });
      prices.belongsTo(models.pricesApplicableTimeframes, {
        foreignKey: 'applicableTimeId',
        as: 'applicableTimeframes',
      });
    }
  }

  prices.init(
    {
      pol: DataTypes.INTEGER,
      pod: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'prices',
      tableName: 'prices',
      paranoid: true,
    },
  );
  return prices;
};
