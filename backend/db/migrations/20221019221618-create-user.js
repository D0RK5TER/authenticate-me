'use strict';
/* @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.VARCHAR,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.VARCHAR,
        allowNull: false,
      },
      username: {
        type: Sequelize.VARCHAR,
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: Sequelize.VARCHAR, ///binary
        allowNull: false,
      },
      email: {
        type: Sequelize.VARCHAR,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};