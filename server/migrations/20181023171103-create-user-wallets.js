'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userwallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      walletId: {
        type: Sequelize.INTEGER,
        allowNull:false,
          onDelete:"CASCADE",
           references:{
             model:"wallets",
             key:"id",
             as:"walletId"
           }
      },

      userId:{
        type: Sequelize.INTEGER,
        allowNull:false,
          onDelete:"CASCADE",
           references:{
             model:"users",
             key:"id",
             as:"userId"
           }
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
    return queryInterface.dropTable('userwallets');
  }
};