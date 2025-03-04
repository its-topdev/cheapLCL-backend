"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("prices", "price");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("price", "prices");
  },
};
