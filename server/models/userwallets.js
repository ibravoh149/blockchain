'use strict';
module.exports = (sequelize, DataTypes) => {
  const userwallets = sequelize.define('userwallets', {
    walletId: {
      type:DataTypes.INTEGER,
      allowNull:false,
        onDelete:"CASCADE",
         references:{
           model:"wallets",
           key:"id",
           as:"walletId"
         }
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull:false,
        onDelete:"CASCADE",
         references:{
           model:"users",
           key:"id",
           as:"userId"
         }
        }
  }, {});
  userwallets.associate = function(models) {
    // associations can be defined here
    userwallets.belongsTo(models.wallets,{foreignKey:'walletId'});
    userwallets.hasMany(models.address, {foreignKey:'userwalletId', onDelete:"cascade"});
    userwallets.belongsTo(models.users,{foreignKey:'userId'});
  };
  return userwallets;
};