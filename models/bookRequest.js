'use strict';
const {
  Model
} = require('sequelize');
const prices = require('./prices');
module.exports = (sequelize, DataTypes) => {
  class bookRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // define association here
      bookRequest.belongsTo(models.prices, {
        foreignKey: "priceId"
      });
      bookRequest.belongsTo(models.shipper, {
        foreignKey: "shipperId"
      });
      bookRequest.belongsTo(models.user, { foreignKey: 'userId', });
      bookRequest.belongsTo(models.bookStatus, { foreignKey: 'bookStatusId', });
      bookRequest.belongsToMany(models.charge, {
        through: models.bookCharge,
        foreignKey: 'bookId',
        otherKey: 'chargeId'
      });
    }

  }
  bookRequest.prototype.getEmailByPol = async function () {
    try {
      const price = await this.getPrice();
      if (!price) {
        return null;
      }
      const pol = await price.getPolObj();
      if (!pol) {
        return null;
      }
      return pol.email;

    } catch (err) {
      return null;
    }
  }

  bookRequest.prototype.getUserObj = async function () {
    try {
      const user = await this.getUser();
      if (!user) {
        return null;
      }

      return user;

    } catch (err) {
      return null;
    }
  }

  bookRequest.prototype.getUserEmail = async function () {
    try {
      const user = await this.getUser();
      if (!user) {
        return null;
      }

      return user.email;

    } catch (err) {
      return null;
    }
  }

  bookRequest.init({
    shipperId: DataTypes.INTEGER,
    priceId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    basePrice: DataTypes.FLOAT,
    weight: DataTypes.INTEGER,
    cbm: DataTypes.INTEGER,
    createdById: DataTypes.INTEGER,
    updatedById: DataTypes.INTEGER,
    bookStatusId: DataTypes.INTEGER,
    vessel: DataTypes.STRING,
    voyage: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'bookRequest',
    tableName: 'book_request',
    paranoid: true
  });
  return bookRequest;
};