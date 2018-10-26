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
    tx_ref: DataTypes.STRING,
    status: DataTypes.STRING,
    type:DataTypes.STRING
  }, {});
  transactions.associate = function(models) {
    // associations can be defined here
    transactions.belongsTo(models.address, {foreignKey:"addressId"});
  };
  return transactions;
};