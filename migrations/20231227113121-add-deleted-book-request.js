'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('book_request');
    if (!tableDescription.deletedAt) {
      return queryInterface.addColumn('book_request', 'deletedAt', {
        type: Sequelize.DATE,
        after: 'updatedAt',
      });
    }
    return Promise.resolve(); // Ensure a return value
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.removeColumn('book_request', 'deletedAt');
  },
};
