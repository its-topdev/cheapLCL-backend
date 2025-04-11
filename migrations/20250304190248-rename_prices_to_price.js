'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const pricesTableExists = await queryInterface.showAllTables().then(tables => tables.includes('prices'));
    const priceTableExists = await queryInterface.showAllTables().then(tables => tables.includes('price'));

    if (pricesTableExists && !priceTableExists) {
      await queryInterface.renameTable('prices', 'price');
    }
  },

  async down(queryInterface, Sequelize) {
    const priceTableExists = await queryInterface.showAllTables().then(tables => tables.includes('price'));
    const pricesTableExists = await queryInterface.showAllTables().then(tables => tables.includes('prices'));

    if (priceTableExists && !pricesTableExists) {
      await queryInterface.renameTable('price', 'prices');
    }
  },
};
