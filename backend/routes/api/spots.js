const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, sequelize, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { Op } = require("sequelize");
// const {op}
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];
router.get('/current',
    async (req, res) => {
        const user = req.user.id
        const spot = await Spot.findAll({
            where: { ownerId: user },
            include: [{
                model: Review,
                attributes: [], //to disappear//
            },
            {
                model: SpotImage,
                attributes: [],
                where: {
                    preview: true
                },
            }
            ],
            attributes: {
                include: [
                    [
                        sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                        "avgRating"
                    ],
                    [
                        sequelize.col("SpotImages.url"),
                        'previewImage'
                    ]
                ],
            },

            group: ['Spot.id']
        })
        res.json({ Spots: spot })
        // console.log(reviews)
    })
// /:spotId/reviews
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params
    const reviews = await Review.findAll({
        where: { spotId: spotId },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }, {
            model: ReviewImage,
            attributes: ['id', 'url']
        }],
    })
    res.json({ Reviews: reviews })
})

router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params
    const spot = await Spot.findOne({
        where: { id: spotId },
        include: [{
            model: SpotImage,
        },
        {
            model: User,
            where: { id: spotId },
            // as: 'Owner'
        },
        {
            model: Review,
            where: { spotId: spotId },
            attributes: []
        },],
        attributes: {
            include: [
                [sequelize.fn("COUNT", sequelize.col("Reviews.Id")), "numReviews"],
                [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
                // [sequelize.col('User'), 'Owner']
                // async get(instances: Model | Array<Model>, options: object): Promise<Model>
            ]

        }
        // ],



    })
    res.json(spot)
})
//     },

//     group: ['Spot.id']
// })
// res.json(spot)
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({

        include: [{
            model: Review,
            attributes: [], //to disappear//
        },
        {
            model: SpotImage,
            attributes: [],
            where: {
                preview: true
            },
        }
        ],
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                    "avgRating"
                ],
                [
                    sequelize.col("SpotImages.url"),
                    'previewImage'
                ]
            ],
        },

        group: ['Spot.id']
    })
    res.json(spots)
})



module.exports = router;