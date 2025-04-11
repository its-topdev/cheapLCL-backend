'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');
    if (!tableDescription.deletedAt) {
      return queryInterface.addColumn('users', 'deletedAt', {
        type: Sequelize.DATE,
        after: 'updatedAt',
      });
    }
    return Promise.resolve(); // Ensure a return value
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.removeColumn('users', 'deletedAt');
  },
};
