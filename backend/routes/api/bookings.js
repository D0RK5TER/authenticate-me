const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, sequelize, SpotImage, Booking } = require('../../db/models');
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

router.get('/current',
    // console.log(validateLogin),
    async (req, res) => {
        validateLogin  //chekc to see if logged ins
        const user = req.user.id
        const bookings = await Booking.findAll({
            where: { userId: user },
            include: { model: Spot },
            // order: [['id'], ['spotId'], [Spot, 'id']]
        })
        // console.log(validateLogin),
        res.json({ Bookings: bookings })
    })

router.get('/',
    // restoreUser,
    async (req, res) => {
        const bookings = await Booking.findAll({

        })
        res.json(bookings)
    })

module.exports = router;