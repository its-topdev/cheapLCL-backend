'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('ports');
    if (!tableDescription.countryId) {
      await queryInterface.addColumn('ports', 'countryId', {
        type: Sequelize.INTEGER,
      });
      await queryInterface.addConstraint('ports', {
        fields: ['countryId'],
        type: 'foreign key',
        name: 'country_id_fk',
        references: {
          table: 'countries',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
    }
    return Promise.resolve(); // Ensure a return value
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeConstraint('ports', 'country_id_fk');
    return queryInterface.removeColumn('ports', 'countryId');
  },
};
