'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface
        .createTable('book_status', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
          },
        })
        .then(() => {
          queryInterface.bulkInsert('book_status', [
            {
              name: 'created',
            },
            {
              name: 'cancelled',
            },
          ]);
        }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('book_status');
  },
};
