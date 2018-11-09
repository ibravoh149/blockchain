'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      addressId: {
        type:Sequelize.INTEGER,
        allowNull:false,
      },
      userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:"CASCADE",
          references:{
            model:"users",
            key:"id",
            as:"userId"
          }
      },
      transaction_amount:Sequelize.INTEGER,
    type:
    {
      type:Sequelize.STRING
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions');
  }
};