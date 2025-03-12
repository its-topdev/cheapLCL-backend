'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface
        .createTable('user_status', {
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
          queryInterface.bulkInsert('user_status', [
            {
              name: 'created',
            },
            {
              name: 'verified',
            },
            {
              name: 'confirmed',
            },
            {
              name: 'rejected',
            },
          ]);
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
