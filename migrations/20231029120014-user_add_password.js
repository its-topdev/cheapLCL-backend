'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');
    if (!tableDescription.password) {
      return queryInterface.addColumn('users', 'password', {
        type: Sequelize.STRING,
        after: 'email',
      });
    }
    return Promise.resolve(); // Ensure a return value
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.removeColumn('users', 'password');
  },
};
