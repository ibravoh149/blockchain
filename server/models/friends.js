'use strict';
module.exports = (sequelize, DataTypes) => {
  const friends = sequelize.define('friends', {
    userId: {
     type:DataTypes.INTEGER,
     allowNull:false,
     onDelete:"CASCADE",
      references:{
        model:"users",
        key:"id",
        as:"userId"
      }
    },
    friendId: {
      type:DataTypes.INTEGER,
      allowNull:false
     },
    
  }, {});
  friends.associate = function(models) {
    // associations can be defined here

    friends.belongsTo(models.users,{foreignKey:'userId'});
  };
  return friends;
};