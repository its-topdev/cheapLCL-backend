'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pol: {
        type: Sequelize.INTEGER,
        references: { model: 'ports', key: 'id' }

      },
      pod: {
        type: Sequelize.INTEGER,
        references: { model: 'ports', key: 'id' }
      },
      vesselId: {
        type: Sequelize.INTEGER,
        references: { model: 'vessels', key: 'id' },
        primaryKey: true,
      },
      voyage: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      departureDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('prices');
  }
};