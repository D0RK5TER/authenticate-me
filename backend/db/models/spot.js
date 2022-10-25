'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The 'models/index' file will call this method automatically.
    //  */
    // checkCreate() {
    //   const { address, city, state, country, lat, lng, name, description, price } = this;
    //   if (typeof address !== 'string' || typeof city !== 'string' || typeof state !== 'string' || typeof country !== 'string' || typeof lat !== 'number' || typeof lng !== 'number' || typeof name !== 'string') {
    //     return new Error()
    //   }
    // , description, price )
    // return
    // }
    static associate(models) {
      // define association here
      // Spot.belongsTo(models.User, {foreignKey: userId, as: 'ownerId'})
      Spot.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId', })
      Spot.hasMany(models.SpotImage,)
      Spot.hasMany(models.Booking)
      Spot.hasMany(models.Review)

      // Spot.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerId' })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
      },
      onDelete: 'CASCADE'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 50]
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};