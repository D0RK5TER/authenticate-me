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



/////THIS IS FOR TESTING PURPOSES////////
// router.get('/',
//     async (req, res) => {
//         const reviews = await Review.findAll({

//         })
//         res.json(reviews)
//     })

router.get('/current',
    requireAuth,
    async (req, res) => {
        const user = req.user.id
        const Reviews = await Review.findAll({
            where: { userId: user },
            include: [{ model: ReviewImage, attributes: ['id', 'url'] }, { model: User, attributes: ['id', 'firstName', 'lastName'] }]
        })
        for (let review of Reviews) {
            const rev = review.dataValues
            const spot = await Spot.findOne({
                where: { id: rev.spotId },
                include: [{ model: SpotImage, attributes: [] }],
                attributes: { exclude: ['createdAt', 'updatedAt'] }

            })
            spot.dataValues.previewImage = await SpotImage.getPreview(spot.id)

            rev.Spot = spot
        }

        res.json({ Reviews })
    })
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
router.post('/:reviewId/images',
    requireAuth,
    async (req, res) => {
        const { reviewId } = req.params
        const { url } = req.body
        const userId = req.user.id

        const rev = await Review.findOne({
            where: { id: reviewId },

        })

        if (!rev) {
            err = new Error('Review couldn`t be found')
            err.status = 404
            throw err
        }
        if (rev.userId !== userId) {
            const err = new Error('Forbidden');
            err.status = 403
            throw err
        }
        // console.log(re)
        if (rev.dataValues.ReviewImages) {
            if (rev.dataValues.ReviewImages.length >= 10) {
                const err = new Error('Maximum number of images for this resource was reached');
                err.status = 403
                throw err
            }
        }
        const newAdd = await ReviewImage.create({
            reviewId,
            url
        })
        res.json({ id: newAdd.id, url: newAdd.url })
    })
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
router.put('/:reviewId',
    requireAuth,
    async (req, res) => {
        const { reviewId } = req.params
        const { review, stars } = req.body
        const user = req.user.id

        const theRev = await Review.findByPk(reviewId)
        if (!theRev) {
            const err = new Error('Review couldn`t be found')
            err.status = 404
            throw err
        }
        if (theRev.dataValues.userId !== user) {
            const err = new Error('Forbidden');
            err.status = 403
            throw err
        }

        if (!review && !stars) {
            const err = new Error('Validation error')
            err.status = 400
            err.errors = {
                'review': 'Review text is required',
                'stars': 'Stars must be an integer from 1 to 5',
            }
            throw err
        }

        theRev.dataValues.review = review
        theRev.dataValues.stars = stars
        await theRev
        res.json(theRev)

    })
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

router.delete('/:reviewid',
    requireAuth,
    async (req, res) => {
        const { reviewid } = req.params
        const user = req.user.id
        const theReview = await Review.findOne({ where: { id: reviewid } })

        if (!theReview) {
            let er = new Error('Review couldn`t be found')
            er.status = 404
            throw er
        } else if (theReview.userId !== user) {
            const err = new Error('Forbidden');
            err.status = 403
            throw err
        }

        else {
            await theReview.destroy()

            res.json({
                'message': 'Successfully deleted',
                'statusCode': 200
            })
        }

    })



module.exports = router;