'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('prices');
    if (!tableDescription.deletedAt) {
      await queryInterface.addColumn('prices', 'deletedAt', {
        type: Sequelize.DATE,
      });
    }
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('prices', 'deletedAt');
  },
};
