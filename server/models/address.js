'use strict';
module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define('address', {
   userwalletId:{
     type:DataTypes.INTEGER,
     allowNull:false,
     onDelete:"CASCADE",
      references:{
        model:"userwallets",
        key:"id",
        as:"userwalletId"
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
  network:DataTypes.STRING,
  address:DataTypes.STRING,
  label:DataTypes.STRING
  }, {});
  address.associate = function(models) {
    // associations can be defined here
    address.belongsTo(models.userwallets,{foreignKey:"userwalletId"});
    address.belongsTo(models.users, {foreignKey:"userId"});
    address.hasOne(models.balance,{foreignKey:"addressId", onDelete:'cascade'});
  };
  return address;
};