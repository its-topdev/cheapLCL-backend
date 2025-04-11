'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('charges');
    if (!tableDescription.minPrice) {
      await queryInterface.addColumn('charges', 'minPrice', {
        type: Sequelize.FLOAT,
        allowNull: true,
        after: 'price',
      });
    }
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('charges', 'minPrice');
  },
};
