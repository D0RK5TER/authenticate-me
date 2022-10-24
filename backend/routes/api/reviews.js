const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, sequelize, SpotImage, Sequelize, DataTypes } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const queryInterface = sequelize.getQueryInterface();

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
    requireAuth,
    async (req, res) => {
        const user = req.user.id
        ////get all the reveiews for current user/////
        const Reviews = await Review.findAll({
            where: { userId: user },
            include: [{ model: ReviewImage, attributes: ['id', 'url'] }]
        })
        //loop through the array of reviews
        for (let rev of Reviews) {
            //find the user of review
            const user = await User.findOne({
                where: { id: rev.userId },
                attributes: ['id', 'firstName', 'lastName']
            })
            //find the spot of the review
            const spot = await Spot.findOne({
                where: { id: rev.spotId },
                include: [
                    {
                        model: SpotImage,
                        attributes: [],
                        where: {
                            preview: true
                        },
                    }],
                //change the stupid col name
                attributes: {
                    include: [
                        [
                            sequelize.col("SpotImages.url"),
                            'previewImage'
                        ]
                    ],
                    exclude: ['createdAt', 'updatedAt']
                },
            })
            //assign the user and spot we awaited to each review obj
            rev.dataValues.User = user
            rev.dataValues.Spot = spot
            console.log(rev)
        }

        res.json({ Reviews })
    })

////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
// router.get('/current',
//     requireAuth,
//     async (req, res) => {
//         const user = req.user.id
//         // const Muser = await User.findByPk(user)

//         const Reviews = await Review.findAll({
//             where: { userId: user, },
//             include: [
//                 {
//                     model: User,
//                     attributes: ['id', 'firstName', 'lastName']
//                 },
//                 {
//                     model: Spot,
//                     include: [{
//                         model: SpotImage,
//                         as: 'previewImage',
//                         // where: { preview: 'TRUE' },
//                         attributes: ['url']
//                     },
//                     ],
//                     attributes: {
//                         // include: [sequelize.col("previewImage"), "numReviews"]
//                     }
//                 },

//                 // attributes:{include:['previewImages']}

//                 // },
//                 {
//                     model: ReviewImage,
//                     attributes: ['id', 'url']
//                 }

//             ],
//             // attributes: {include: [[sequelize.col("url"), "previewImage"]]}
//         })

// Reviews.update('SpotImages', Reviews.Spot.dataValues.SpotImages[0].url)
// Reviews[0].Spot.dataValues['previewImage'] = Reviews[0].Spot.SpotImages[0].url
// queryInterface.addColumn('Spots', "previewImage", { type: DataTypes.STRING, defaultValue: 'hey' })
// res.json({ Reviews })
// console.log(reviews)
// })
////// ////// //////////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// ////// ////// 
// attributes: {
//     includes: [
//         [
//             sequelize.col("SpotImages.url"),
//             'previewImage'
//         ]
//     ],
// },



module.exports = router;