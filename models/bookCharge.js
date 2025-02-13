'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookCarge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bookCarge.belongsTo(models.bookRequest, { foreignKey: 'bookId' });
      bookCarge.belongsTo(models.charge, { foreignKey: 'chargeId' });    }
  }
  bookCarge.init({
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'bookCarge',
    timestamps: false,
    modelName: 'bookCharge',
    tableName: 'book_charges'
  });
  return bookCarge;
};