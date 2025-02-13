'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('price_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      priceId: {
        type: Sequelize.INTEGER,
        references: { model: 'prices', key: 'id' }
      },
      priceFirst: {
        type: Sequelize.INTEGER
      },
      priceSecond: {
        type: Sequelize.INTEGER
      },
      priceThird: {
        type: Sequelize.INTEGER
      },
      priceDate: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      createdById: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      updatedById: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('price_histories');
  }
};