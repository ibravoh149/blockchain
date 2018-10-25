'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userwalletId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:"CASCADE",
         references:{
           model:"userwallets",
           key:"id",
           as:"userwalletId"
         }
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
     network:Sequelize.STRING,
     address:Sequelize.STRING,
     label:Sequelize.STRING,
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
    return queryInterface.dropTable('addresses');
  }
};