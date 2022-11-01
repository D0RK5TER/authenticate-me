'use strict';
// const { User, Review, ReviewImage, SpotImage, BookingdataValues } = require('../mod ');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {

    static async getSpot(thisId) {
      let spot = await Spot.findOne({
        where: { id: thisId },
        include: [{ model: SpotImage, required: false }]
      })
      // console.log(spot)
      return spot
    }

    // static async getPreview(thisId) {
    //   let imgURL = await SpotImage.findOne({
    //     where: { spotId: thisId, preview: true },
    //     attributes: ['url']
    //   })
    //   return imgURL
    // }
    // static async getOwner(thisId) {
    //   let owner = await User.findOne({
    //     where: { id: thisId },
    //     attributes: ['id', 'firstName', 'lastName']
    //   })
    //   return owner
    // }
    // static async getRating(thisId) {
    //   const revs = await Review.findAll({
    //     where: { spotId: thisId },
    //     attributes: ['stars']
    //   })
    //   console.log(revs)
    //   let i = 0
    //   let s = 0
    //   while (i < revs.length) {
    //     console.log(revs[i])
    //     s += revs[i].dataValues.stars
    //     i++
    //   }
    //   return s / i
    // }
    // static async getNumRevs(thisId) {
    //   let num = await Review.findAndCountAll({
    //     where: { spotId: thisId },
    //   })

    //   return num
    // }

    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' })
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' })
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' })
      Spot.hasMany(models.Review, { foreignKey: 'spotId' })
      Spot.belongsToMany(models.User, { through: models.Booking, foreignKey: 'spotId' })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,

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