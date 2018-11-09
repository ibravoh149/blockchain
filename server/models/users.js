'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
  }, {});
  users.associate = function(models) {
    // associations can be defined here
    users.hasMany(models.friends, {foreignKey:'userId', onDelete:'CASCADE', as:'friends'});
    users.hasMany(models.userwallets, {foreignKey:'userId', onDelete:'cascade'});
    users.hasMany(models.address,{foreignKey:'userId', onDelete:'CASCADE', as :'address'});
    users.hasMany(models.transactions,{foreignKey:'userId', onDelete:'CASCADE'});

  };
  return users;
};