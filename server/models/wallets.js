'use strict';
module.exports = (sequelize, DataTypes) => {
  const wallets = sequelize.define('wallets', {
    name: DataTypes.STRING
  }, {});
  wallets.associate = function(models) {
    // associations can be defined here

    wallets.hasMany(models.userwallets,{foreignKey:'walletId', onDelete:"cascade"});
  };
  return wallets;
};