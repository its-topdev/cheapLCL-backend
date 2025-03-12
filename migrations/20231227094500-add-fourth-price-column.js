'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface
        .addColumn('prices', 'priceFourth', {
          type: Sequelize.INTEGER,
          after: 'priceThird',
        })
        .then(() => {
          queryInterface.addColumn('price_histories', 'priceFourth', {
            type: Sequelize.INTEGER,
            after: 'priceThird',
          });
        }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
