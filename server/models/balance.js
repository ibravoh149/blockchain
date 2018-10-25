'use strict';
module.exports = (sequelize, DataTypes) => {
  const balance = sequelize.define('balance', {
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
    network:DataTypes.STRING,
    available_balance:DataTypes.STRING,
    pending_received_balance:DataTypes.STRING,
  }, {});
  balance.associate = function(models) {
    // associations can be defined here
    balance.belongsTo(models.address, {foreignKey:"addressId"});
  };
  return balance;
};