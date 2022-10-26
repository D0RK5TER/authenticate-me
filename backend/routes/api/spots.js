const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage, Booking, sequelize, Sequelize, checkCreate, dataValues } = require('../../db/models');
const { check } = require('express-validator');
const { Op, ValidationError } = require('sequelize');
const queryInterface = sequelize.getQueryInterface();
const { handleValidationErrors } = require('../../utils/validation');
const { urlencoded } = require('express');
const e = require('express');
const spotimage = require('../../db/models/spotimage');

const router = express.Router();

router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params
    const theSpot = await Spot.findByPk(spotId)
    if (!theSpot) {
        err = new Error('Spot couldn`t be found')
        err.status = 404
        throw err
    }
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
router.get('/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        const { spotId } = req.params
        const user = req.user.id
        // const spat = await Spot.findByPk(spotId)
        const spat = await Spot.findOne({ where: { id: spotId } })
        if (!spat) {
            let er = new Error('Spot couldn`t be found')
            er.status = 404
            throw er
        }
        if (spat.ownerId == user) {
            const Bookings = await Booking.findAll({
                where: { spotId: spotId },
            })
            for (let x of Bookings) {
                x.dataValues['User'] = await User.findOne({
                    where: { id: x.dataValues.userId },
                    attributes: { exclude: ['username'] }
                })
            }
            res.json({ Bookings })
        } else {
            const Bookings = await Booking.findAll({
                where: { spotId: spotId },
                attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'userId'] }
            })
            res.json({ Bookings })
        }
    })
// include: [
//         [
//             sequelize.col('url'),
//             'previewImage'
//         ],]
router.get('/current',
    requireAuth,
    async (req, res) => {
        const user = req.user.id
        const spot = await Spot.findAll({
            where: { ownerId: user },
            include: [{
                model: Review,
                attributes: [],
            },
            {
                model: SpotImage,
                where: {
                    preview: true
                },
                attributes: [],
            },
            ],
            attributes: {
                include: [
                    [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                    [sequelize.col('SpotImages.url'), 'previewImage']
                ]

            },

        })
        res.json({ Spots: spot })
        // console.log(reviews)
    })

router.get('/', async (req, res) => {

    const spots = await Spot.findAll({
        // include: [{
        //     model: Review,
        //     attributes: []
        // }],
        // {
        //     model: SpotImage,
        //     attributes: [],
        //     where: {
        //         preview: true
        //     },
        //     required: false
        // }
        // ],
        //     attributes: {
        //         include: [
        //             [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
        //             [sequelize.col('url'), 'previewImage']
        //         ],
        //     },
    })

    for (let x of spots) {

        const revs = await Review.findAll({
            // where: { spotId: x.id },
            // attributes: { include: [[sequelize.fn('AVG', sequelize.col('stars')), 'avg']] }
        })
        // x.dataValues.avgRating = revs[0].dataValues.avg
        // const img = await SpotImage.findOne({
        //     where: { spotId: x.id },
        //     attributes: ['url']
        // })
        x.dataValues.previewImage = revs.dataValues




    }
    console.log(spots)


    res.json(spots)
})

router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params

    const spotCheck = await Spot.findByPk(spotId)

    if (!spotCheck) {
        err = new Error('Spot couldn`t be found')
        err.status = 404
        throw err
    }

    const spot = await Spot.findOne({
        where: { id: spotId },
        include: [{
            model: SpotImage,
            attributes: ['id', 'url', 'preview'],
        },
        {
            model: User,
            as: 'Owner',
            where: { id: spotId },
            attributes: ['id', 'firstName', 'lastName'],
        },
        {
            model: Review,
            where: { spotId: spotId },
            attributes: []
        },],
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'numReviews'],
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
            ]
        }
    })

    res.json(spot)
})


/////  GET ^///////  GET ^ ////// GET  ^ ///// GET  ^ ///////  GET ^ //////  GET ^/////

/////  POST v ///////  POST v ////// POST  v ///// POST  v ///////  POST v //////  POST v/////
router.post('/:spotId/images',
    requireAuth,
    async (req, res) => {
        const { url, preview } = req.body
        const { spotId } = req.params
        const theSpot = await Spot.findByPk(spotId)

        if (!theSpot) {
            const err = new Error('Spot couldn`t be found');
            err.status = 404
            throw err
        }
        const user = req.user.id
        if (theSpot.ownerId == user) {
            const err = new Error('Forbidden');
            err.status = 403
            throw err
        }

        const imga = await SpotImage.create({
            spotId: spotId,
            url,
            preview
        },
        )
        const newImga = await SpotImage.findOne({
            where: { spotId: spotId, url },
            attributes: {
                exclude: ['spotId', 'createdAt', 'updatedAt']
            }
        })
        res.json(newImga)
    }
)

router.post('/:spotId/reviews',
    requireAuth,
    async (req, res, next) => {
        const { review, stars } = req.body
        const { spotId } = req.params
        const userId = req.user.id

        if (review == undefined || stars == undefined) {
            err = new Error('Validation Error')
            err.status = 400
            err.errors = {
                'review': 'Review text is required',
                'stars': 'Stars must be an integer from 1 to 5',
            }
            throw err
        }



        const theSpot = await Spot.findByPk(spotId)
        const currReviews = await Review.findAll({ where: { spotId: spotId } })

        if (!theSpot) {
            const err = new Error('Spot couldn`t be found');
            err.status = 404
            throw err

        }
        for (let re of currReviews) {
            if (re.userId === userId) {
                const err = new Error('User already has a review for this spot')
                err.status = 403
                throw err


            }
        }
        if (review && stars) {
            const newReview = await Review.create({
                spotId: +spotId,
                userId,
                review,
                stars
            })
            res.status(201)
            res.json(newReview)
        }
    }
)
router.post('/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        const { startDate, endDate } = req.body
        const { spotId } = req.params
        const userId = req.user.id

        const start = new Date(startDate)
        const end = new Date(endDate)
        const theSpot = await Spot.findByPk(spotId)

        if (end <= start) {
            const err = new Error('Validation error')
            err.status = 400,
                err.errors = {
                    'endDate': 'endDate cannot be on or before startDate'
                }
            throw err
        }
        const spat = await Spot.findByPk(spotId)
        if (!spat) {
            let er = new Error('Spot couldn`t be found')
            er.status = 404
            throw er
        }
        const curBoo = await Booking.findAll({})

        for (let boo of curBoo) {
            let startCheck = new Date(boo.startDate).valueOf()
            let endCheck = new Date(boo.endDate).valueOf()

            if (startCheck <= start.valueOf() && start.valueOf() <= endCheck) {
                const err = new Error('Sorry, this spot is already booked for the specified dates')
                err.status = 403,
                    err.errors = {
                        'startDate': 'Start date conflicts with an existing booking',
                        'endDate': 'End date conflicts with an existing booking'
                    }
                throw err
            }
        }
        const newBook = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate
        })
        res.json(newBook)
    })


router.post('/',
    requireAuth,
    async (req, res, next) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const user = req.user.id


        if (address == undefined || city == undefined || state == undefined
            || country == undefined || lat == undefined || lng == undefined
            || name == undefined || description == undefined || price == undefined) {
            let er = new Error('Validation Error')
            er.status = 400
            er.errors = {
                'address': 'Street address is required',
                'city': 'City is required',
                'state': 'State is required',
                'country': 'Country is required',
                'lat': 'Latitude is not valid',
                'lng': 'Longitude is not valid',
                'name': 'Name must be less than 50 characters',
                'description': 'Description is required',
                'price': 'Price per day is required'
            }
            throw er
        }

        const newSpot = await Spot.create({
            ownerId: user,
            address, city, state, country, lat, lng, name, description, price
        })
        // res.status(201)
        res.json(newSpot)

        // }
    },
)
/////  POST ^///////  POST ^ ////// POST  ^ ///// POST  ^ ///////  POST ^ //////  POST ^/////

/////  PUT v ///////  PUT v ////// PUT  v ///// PUT  v ///////  PUT v //////  PUT v/////

router.put('/:spotId',
    requireAuth,
    async (req, res) => {
        const { spotId } = req.params
        const user = req.user.id

        const { address, city, state, country,
            lat, lng, name, description, price } = req.body

        let theSpot = await Spot.findOne({
            where: { id: spotId }
        })
        if (!theSpot) {
            let er = new Error('Spot couldn`t be found')
            er.status = 404
            throw er
        }
        if (theSpot.ownerId !== user) {
            const err = new Error('Forbidden');
            err.status = 403
            throw err
        }


        if (address == undefined || city == undefined || state == undefined
            || country == undefined || lat == undefined || lng == undefined
            || name == undefined || description == undefined || price == undefined) {
            let er = new Error('Validation Error')
            er.status = 400
            er.errors = {
                'address': 'Street address is required',
                'city': 'City is required',
                'state': 'State is required',
                'country': 'Country is required',
                'lat': 'Latitude is not valid',
                'lng': 'Longitude is not valid',
                'name': 'Name must be less than 50 characters',
                'description': 'Description is required',
                'price': 'Price per day is required'

            }
            // }
            throw er
        }
        theSpot.address = address
        theSpot.city = city
        theSpot.state = state
        theSpot.country = country
        theSpot.lat = lat
        theSpot.lng = lng
        theSpot.name = name
        theSpot.description = description
        theSpot.price = price
        theSpot.save()
        res.json(theSpot)
    }
)
/////  PUT ^///////  PUT ^ ////// PUT  ^ ///// PUT  ^ ///////  PUT ^ //////  PUT ^/////

/////  DELETE v ///////  DELETE v  ////// DELETE   v ///// DELETE   v ///////  DELETE v  //////  DELETE v /////
router.delete('/:spotid',
    requireAuth,
    async (req, res) => {
        const { spotid } = req.params
        const user = req.user.id

        const theSpot = await Spot.findOne({ where: { id: spotid } })

        if (!theSpot) {
            let er = new Error('Spot couldn`t be found')
            er.status = 404
            throw er
        }

        if (theSpot.ownerId !== user) {
            const err = new Error('Forbidden');
            err.status = 403
            throw err
        } else {
            await theSpot.destroy()

            res.json({
                'message': 'Successfully deleted',
                'statusCode': 200
            })
        }

    })

module.exports = router;