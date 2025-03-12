'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('testste');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('carriers');
  },
};
