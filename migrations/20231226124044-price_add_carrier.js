'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('prices', 'carrierId', {
        type: Sequelize.INTEGER,
        after: "pod"
      }).then(() => {
        queryInterface.addConstraint('prices', {
          fields: ['carrierId'],
          type: 'foreign key',
          name: 'carrier_id_fk',
          references: { //Required field
            table: 'carriers',
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
