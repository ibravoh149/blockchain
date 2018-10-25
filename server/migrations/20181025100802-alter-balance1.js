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
      'balances',
      'network',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    ),
    queryInterface.addColumn(
      'balances',
      'available_balance',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    ),
    queryInterface.addColumn(
      'balances',
      'pending_received_balance',
      {
        type: Sequelize.STRING,
        allowNull: false
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
   return [
    queryInterface.removeColumn('balances', 'network'),
    queryInterface.removeColumn('balances', 'available_balance'),
    queryInterface.removeColumn('balances', 'pending_received_balance')
  ];
  }
};
