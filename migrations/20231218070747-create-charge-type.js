'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.createTable('charge_type', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
      }).then(() => {
        queryInterface.bulkInsert('charge_type', [
          {
            name: 'fixed'
          },
          {
            name: 'calculated'
          }
        ]);
      })
    ])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chargeTypes');
  }
};