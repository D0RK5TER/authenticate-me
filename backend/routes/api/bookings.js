const express = require("express")

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, ReviewImage, sequelize, SpotImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateLogin = [
    check("credential")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Please provide a valid email or username."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
    handleValidationErrors
];
router.get("/",
    // restoreUser,
    async (req, res) => {
        const bookings = await Booking.findAll({

        })
        res.json(bookings)
    })

router.get("/current",
    // console.log(validateLogin),
    async (req, res) => {
        validateLogin  //chekc to see if logged ins
        const user = req.user.id
        const bookings = await Booking.findAll({
            where: { userId: user },
            include: { model: Spot },
        })
        for (let boo of bookings) {
            const spot = await Spot.findOne({
                where: { id: boo.spotId },
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
                            "previewImage"
                        ]
                    ],
                    exclude: ["createdAt", "updatedAt", "description"]
                },
            })
            boo.dataValues.Spot = spot
        }
        res.json({ Bookings: bookings })
    })

router.put("/:bookingId",
    // restoreUser,
    requireAuth,
    async (req, res) => {
        const user = req.user.id
        const { startDate, endDate } = req.body
        const { bookingId } = req.params
        const bookings = await Booking.findOne({
            where: { id: bookingId }
        })

        let today = new Date()
        today = Date.parse(today)
        const tryBook = Date.parse(startDate)

        if (!bookings) {
            let er = new Error("Booking couldn't be found")
            er.status = 404
            throw er
        } else if (bookings.userId !== user) {
            const err = new Error("Forbidden");
            err.status = 403
            throw err
        }//////////////////////////////////////////////////////////////////////////////////////
        else if (Date.parse(startDate) >= Date.parse(endDate)) {
            let er = new Error("Validation error")
            er.status = 400
            er.errors = { "endDate": "endDate cannot come before startDate" }
            throw er
        }
        else if (today >= Date.parse(startDate) || today >= Date.parse(endDate)) {
            // console.log("heyy")
            let er = new Error("Past bookings can't be modified")
            er.status = 403
            throw er
        }
        else if (Date.parse(bookings.startDate) >= Date.parse(bookings.endDate)) {
            let er = new Error("Past bookings can't be modified")
            er.status = 400
            // er.errors = { "endDate": "endDate cannot come before startDate" }
            throw er
        }

        let occupied = await Booking.findAll({
            include: { model: Spot },
            where: { id: bookings.spotId }
        })
        // console.log(occupied, "djbsdfksdnfnlskdf")
        for (let boo of occupied) {
            let startCheck = new Date(boo.startDate)
            let endCheck = new Date(boo.endDate)
            const start = new Date(startDate)
            // const end = new Date(endDate)
            // console.log(boo.startDate, startDate)
            if (startCheck <= start && start <= endCheck) {
                const err = new Error("Sorry, this spot is already booked for the specified dates")
                err.status = 403,
                    err.errors = {
                        "startDate": "Start date conflicts with an existing booking",
                        "endDate": "End date conflicts with an existing booking"
                    }
                throw err
            }
        }
        bookings.startDate = startDate
        bookings.endDate = endDate
        res.json(bookings)

    })
router.delete("/:bookingid",
    requireAuth,
    async (req, res) => {
        const { bookingid } = req.params
        const user = req.user.id
        const thebooking = await Booking.findOne({ where: { id: bookingid } })
        if (!thebooking) {
            let er = new Error("Review booking couldn't be found")
            er.status = 404
            throw er
        }
        let today = new Date().valueOf()
        let Boday = thebooking.startDate
        // console.log(today, "132353453453453", Date.parse(Boday))
        // console.log(thebooking, bookingid)
        const spat = await Spot.findOne({ where: { id: thebooking.spotId } })
        if (!(thebooking.userId == user || spat.ownerId == user)) {
            const err = new Error("Forbidden");
            err.status = 403
            throw err
        } else if (Date.parse(Boday) < today) {
            let er = new Error("Bookings that have been started can't be deleted")
            er.status = 403
            throw er
        }
        else {
            await thebooking.destroy()

            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })
        }

    })

module.exports = router;