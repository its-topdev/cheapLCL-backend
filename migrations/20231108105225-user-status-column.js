'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');
    if (!tableDescription.user_status) {
      await queryInterface.addColumn('users', 'user_status', {
        type: Sequelize.INTEGER,
      });
      await queryInterface.addConstraint('users', {
        fields: ['user_status'],
        type: 'foreign key',
        name: 'user_status_fk',
        references: {
          table: 'user_status',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
    }
    return Promise.resolve(); // Ensure a return value
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeConstraint('users', 'user_status_fk');
    return queryInterface.removeColumn('users', 'user_status');
  },
};
