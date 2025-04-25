'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('companies', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			client_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			client_identity: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			client_name_eng: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('companies');
	},
};
