'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('book_request');
    if (!tableDescription.bookStatusId) {
      await queryInterface.addColumn('book_request', 'bookStatusId', {
        type: Sequelize.INTEGER,
      });
      await queryInterface.addConstraint('book_request', {
        fields: ['bookStatusId'],
        type: 'foreign key',
        name: 'book_status_fk',
        references: {
          table: 'book_status',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
    }
    return Promise.resolve(); // Ensure a return value
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeConstraint('book_request', 'book_status_fk');
    return queryInterface.removeColumn('book_request', 'bookStatusId');
  },
};
