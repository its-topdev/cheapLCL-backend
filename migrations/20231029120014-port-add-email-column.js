'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('ports');
    if (!tableDescription.email) {
      return queryInterface.addColumn('ports', 'email', {
        type: Sequelize.STRING,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('ports', 'email');
  },
};
