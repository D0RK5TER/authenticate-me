'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The 'models/index' file will call this method automatically.
  */
     static async getRating(thisId) {
      const revs = await Review.findAll({
        where: { spotId: thisId },
        attributes: ['stars']
      })
      console.log(revs)
      let i = 0
      let s = 0
      while (i < revs.length) {
        console.log(revs[i])
        s += revs[i].dataValues.stars
        i++
      }
      return s / i
    }
    static async getNumRevs(thisId) {
      let num = await Review.findAndCountAll({
        where: { spotId: thisId },
      })

      return num
    }
    // static async getRevImgs(review){
    //   let imgs = await ReviewImages.findAll({
    //     where: {reviewId: review.id},
    //     attributes: ['id', 'url']
    //   })
    //   return imgs
    // }
    static associate(models) {
      // define association here
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' })

      Review.belongsTo(models.Spot,{ foreignKey: 'spotId' })

      Review.belongsTo(models.User,{ foreignKey: 'userId' })
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};