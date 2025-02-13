'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vessel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      vessel.hasMany(models.price);

    }
  }
  vessel.init({
    name: DataTypes.STRING,
    created_by_id: DataTypes.INTEGER,
    updated_by_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'vessel',
  });
  return vessel;
};