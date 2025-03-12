'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'prices',
      'applicable_timeframe_id',
      'applicableTimeId',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'prices',
      'applicableTimeId',
      'applicable_timeframe_id',
    );
  },
};
