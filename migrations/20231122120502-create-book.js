'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('book_request', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }

      },
      priceId: {
        type: Sequelize.INTEGER,
        references: { model: 'prices', key: 'id' }
      },
      basePrice: {
        type: Sequelize.INTEGER
      },
      'weight': {
        type: Sequelize.INTEGER
      },
      cbm: {
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
    await queryInterface.dropTable('bookRequest');
  }
};