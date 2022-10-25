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
    static associate(models) {
      // define association here
      Review.hasMany(models.ReviewImage)

      Review.belongsTo(models.Spot)

      Review.belongsTo(models.User)
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
      },
      onDelete: 'SET NULL'
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