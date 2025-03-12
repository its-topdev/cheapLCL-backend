const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class chargeType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chargeType.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'chargeType',
      tableName: 'charge_type',
      timestamps: false,
    },
  );
  return chargeType;
};
