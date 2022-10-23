const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, sequelize, SpotImage, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

router.get('/',
    // restoreUser,
    async (req, res) => {
        const reviews = await Review.findAll({

        })
        res.json(reviews)
    })

router.get('/current',
    async (req, res) => {
        const user = req.user.id
        // const Muser = await User.findByPk(user)
        const reviews = await Review.findOne({
            where: { userId: user, },
            include: [
                {
                    model: Spot,
                    include: [{
                        model: SpotImage,
                        attributes: ['url']
                    }],
                },

                // console.log(SpotImage.url)
            ],
        })
        // const revImgs = await ReviewImage.findOne({
        //     where: { userId: user, },
        // })
        // reviews.Spot.dataValues.previewImage = reviews.Spot.dataValues.SpotImages[0].url
        // console.log(reviews.Spot.dataValues.previewImage)
        // reviews.update('SpotImages', reviews.Spot.dataValues.SpotImages[0].url)
        // reviews[0].Spot.dataValues['previewImage'] = reviews[0].Spot.SpotImages[0].url
        res.json(reviews)
        // console.log(reviews)
    })

// attributes: {
//     includes: [
//         [
//             sequelize.col("SpotImages.url"),
//             'previewImage'
//         ]
//     ],
// },



module.exports = router;