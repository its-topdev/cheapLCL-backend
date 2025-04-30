const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class shipper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      shipper.hasMany(models.contact);
      shipper.belongsTo(models.user, { foreignKey: 'userId', as: 'userObj' });
      shipper.belongsTo(models.country, { foreignKey: 'countryId', as: 'countryObj' });
      shipper.belongsTo(models.port, { foreignKey: 'cityId', as: 'cityObj' });
    }
  }
  shipper.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      countryId: DataTypes.INTEGER,
      cityId: DataTypes.INTEGER,
      zip: DataTypes.STRING,
      createdById: DataTypes.INTEGER,
      updatedById: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'shipper',
      paranoid: true,
    },
  );
  return shipper;
};
