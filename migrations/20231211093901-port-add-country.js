'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('ports', 'countryId', {
        type: Sequelize.INTEGER,
      }).then(() => {
        queryInterface.addConstraint('ports', {
          fields: ['countryId'],
          type: 'foreign key',
          name: 'country_id_fk',
          references: { //Required field
            table: 'countries',
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
