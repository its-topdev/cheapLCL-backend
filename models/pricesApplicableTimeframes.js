const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class pricesApplicableTimeframes extends Model {
    static associate(models) {
      pricesApplicableTimeframes.hasMany(models.prices, {
        foreignKey: 'id',
        as: 'prices',
      });
    }
  }

  pricesApplicableTimeframes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      prices_start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      prices_end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'pricesApplicableTimeframes',
      tableName: 'prices_applicable_timeframes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return pricesApplicableTimeframes;
};
