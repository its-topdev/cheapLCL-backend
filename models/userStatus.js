const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userStatus.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'userStatus',
      tableName: 'user_status',
      timestamps: false,
    },
  );
  return userStatus;
};
