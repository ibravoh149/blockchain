'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('wallets',
      [
        {
          name: 'BITCOIN',
          createdAt:new Date(),
          updatedAt:new Date()
        },
        {
          name: 'LITECOIN',
          createdAt:new Date(),
          updatedAt:new Date()

        },
        {
          name: 'STELLAR',
          createdAt:new Date(),
          updatedAt:new Date()

        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('wallets', null, {});

  }
};
