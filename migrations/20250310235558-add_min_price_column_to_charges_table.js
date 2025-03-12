'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('charges', 'minPrice', {
      type: Sequelize.FLOAT,
      allowNull: true,
      after: 'price',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('charges', 'minPrice');
  },
};
