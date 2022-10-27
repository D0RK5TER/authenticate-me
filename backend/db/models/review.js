'use strict';
const {
  Model, sequelize

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
        attributes: { include: [[sequelize.fn('AVG', sequelize.col('stars')), 'rat']] },
        group: ['Review.id']
      })
      if (!revs) return new Error('No reviews yet!')
      return (revs[0].dataValues.rat / revs.length)
    }

    // static async getUser
    static async getNumRevs(thisId) {
      let num = await Review.findAndCountAll({
        where: { spotId: thisId },
      })
      return num.count
    }


    static associate(models) {
      // define association here
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' })

      Review.belongsTo(models.Spot, { foreignKey: 'spotId' })

      Review.belongsTo(models.User, { foreignKey: 'userId' })
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