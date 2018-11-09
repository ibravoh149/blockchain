'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactions = sequelize.define('transactions', {
    addressId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      onDelete:"CASCADE",
        references:{
          model:"address",
          key:"id",
          as:"addressId"
        }
    },
    userId:{
      type:DataTypes.INTEGER,
      allowNull:false,
      onDelete:"CASCADE",
        references:{
          model:"users",
          key:"id",
          as:"userId"
        }
    },
    transaction_amount:DataTypes.INTEGER,
    type:DataTypes.STRING
  }, {});
  transactions.associate = function(models) {
    // associations can be defined here
    transactions.belongsTo(models.address, {foreignKey:"addressId"});
    transactions.belongsTo(models.users, {foreignKey:"userId"});
    
  };
  return transactions;
};