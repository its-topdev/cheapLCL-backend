'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('prices', 'applicable_timeframe_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'prices_applicable_timeframes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('prices', 'applicable_timeframe_id');
  },
};
