'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return [
    queryInterface.addColumn(
      'addresses',
      'weekly_limit',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:5
      }
    ),
    queryInterface.addColumn(
      'addresses',
      'weekly_limit_count_up',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:0
      }
    )
  ];

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn('addresses', 'weekly_limit'),
    queryInterface.removeColumn('addresses', 'weekly_limit_count_up')
  }
};
