'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


    return Promise.all([
      queryInterface.addColumn('users', 'user_status', {
        type: Sequelize.INTEGER,
      }).then(() => {
        queryInterface.addConstraint('users', {
          fields: ['user_status'],
          type: 'foreign key',
          name: 'user_status_fk',
          references: { //Required field
            table: 'user_status',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        })
      })
    ])





     
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
