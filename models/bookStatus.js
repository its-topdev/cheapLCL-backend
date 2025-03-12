const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class bookStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bookStatus.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'bookStatus',
      tableName: 'book_status',
      timestamps: false,
    },
  );
  return bookStatus;
};
