'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('book_request', 'bookStatusId', {
        type: Sequelize.INTEGER,
      }).then(() => {
        queryInterface.addConstraint('book_request', {
          fields: ['bookStatusId'],
          type: 'foreign key',
          name: 'book_status_fk',
          references: { //Required field
            table: 'book_status',
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
