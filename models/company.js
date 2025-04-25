const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class company extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	company.init(
		{
			client_id: DataTypes.STRING,
			client_identity: DataTypes.STRING,
			client_name_eng: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'company',
			tableName: 'companies',
			timestamps: false,
		},
	);
	return company;
};
