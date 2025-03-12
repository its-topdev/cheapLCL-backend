const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class confirmationToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  confirmationToken.init(
    {
      user: DataTypes.INTEGER,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'confirmationToken',
      tableName: 'confirmation_tokens',
    },
  );
  return confirmationToken;
};
