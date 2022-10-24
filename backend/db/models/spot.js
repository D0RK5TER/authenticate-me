'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Spot.belongsTo(models.User, {foreignKey: userId, as: 'ownerId'})
      Spot.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId', })
      Spot.hasMany(models.SpotImage,)
      Spot.hasMany(models.Booking)
      Spot.hasMany(models.Review)

      // Spot.belongsTo(models.User, { as: 'owner', foreignKey: "ownerId" })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      // unique: true,
      references: {
        model: 'Users',
        //   key: 'userId'
      }
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.DECIMAL,
    },
    lng: {
      type: DataTypes.DECIMAL,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL,
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};