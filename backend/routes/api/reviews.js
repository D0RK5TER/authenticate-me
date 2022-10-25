const express = require("express")

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, ReviewImage, sequelize, SpotImage, Sequelize, DataTypes } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const queryInterface = sequelize.getQueryInterface();

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


router.post("/:reviewId/images",
    requireAuth,
    async (req, res) => {
        const { reviewId } = req.params
        const { url } = req.body
        const userId = req.user.id

        const rev = await Review.findOne({
            where: { id: reviewId },
            // attributes: [],
            // include: {
            //     model: ReviewImage
            // }
        })


        // console.log(imgs.length)
        if (!rev) {
            err = new Error("Review couldn"t be found")
            err.status = 404
            throw err
        }
        if (rev.userId !== userId) {
            const err = new Error("Forbidden");
            err.status = 403
            throw err
        }
        const imgs = await ReviewImage.findAll({
            where: { reviewId: reviewId }
        })
        console.log(imgs.length)
        if (imgs.length >= 10) {
            const err = new Error("Maximum number of images for this resource was reached");
            err.status = 403
            throw err
        }


        const newAdd = await ReviewImage.create({
            reviewId,
            url
        })
        const returnAdd = await ReviewImage.findOne({
            where: { id: newAdd.id },
            attributes: ["id", "url"]
        })

        res.json(returnAdd)
    })


router.get("/",
    // restoreUser,
    async (req, res) => {
        const reviews = await Review.findAll({

        })
        res.json(reviews)
    })

router.get("/current",
    requireAuth,
    async (req, res) => {
        const user = req.user.id
        ////get all the reveiews for current user/////
        const Reviews = await Review.findAll({
            where: { userId: user },
            include: [{ model: ReviewImage, attributes: ["id", "url"] }]
        })
        //loop through the array of reviews
        for (let rev of Reviews) {
            //find the user of review
            const user = await User.findOne({
                where: { id: rev.userId },
                attributes: ["id", "firstName", "lastName"]
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
                            "previewImage"
                        ]
                    ],
                    exclude: ["createdAt", "updatedAt"]
                },
            })
            //assign the user and spot we awaited to each review obj
            rev.dataValues.User = user
            rev.dataValues.Spot = spot
            console.log(rev)
        }

        res.json({ Reviews })
    })
router.put("/:reviewId",
    requireAuth,
    async (req, res) => {
        const { reviewId } = req.params
        const { review, stars } = req.body
        const user = req.user.id

        const theRev = await Review.findByPk(reviewId)

        if (!review && !stars) {
            const err = new Error("Validation error")
            err.status = 400
            err.errors = {
                "review": "Review text is required",
                "stars": "Stars must be an integer from 1 to 5",
            }
            throw err
        } else if (!theRev) {
            const err = new Error("Review couldn"t be found")
            err.status = 404
            throw err
        } else if (theRev.userId !== user) {
            const err = new Error("Forbidden");
            err.status = 403
            throw err
        }
        else {
            theRev.review = review
            theRev.stars = stars
            res.json(theRev)
        }
    })
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
// router.get("/current",
//     requireAuth,
//     async (req, res) => {
//         const user = req.user.id
//         // const Muser = await User.findByPk(user)

//         const Reviews = await Review.findAll({
//             where: { userId: user, },
//             include: [
//                 {
//                     model: User,
//                     attributes: ["id", "firstName", "lastName"]
//                 },
//                 {
//                     model: Spot,
//                     include: [{
//                         model: SpotImage,
//                         as: "previewImage",
//                         // where: { preview: "TRUE" },
//                         attributes: ["url"]
//                     },
//                     ],
//                     attributes: {
//                         // include: [sequelize.col("previewImage"), "numReviews"]
//                     }
//                 },

//                 // attributes:{include:["previewImages"]}

//                 // },
//                 {
//                     model: ReviewImage,
//                     attributes: ["id", "url"]
//                 }

//             ],
//             // attributes: {include: [[sequelize.col("url"), "previewImage"]]}
//         })

// Reviews.update("SpotImages", Reviews.Spot.dataValues.SpotImages[0].url)
// Reviews[0].Spot.dataValues["previewImage"] = Reviews[0].Spot.SpotImages[0].url
// queryInterface.addColumn("Spots", "previewImage", { type: DataTypes.STRING, defaultValue: "hey" })
// res.json({ Reviews })
// console.log(reviews)
// })
////// ////// //////////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// ////// ////// 
// attributes: {
//     includes: [
//         [
//             sequelize.col("SpotImages.url"),
//             "previewImage"
//         ]
//     ],
// },
router.delete("/:reviewid",
    requireAuth,
    async (req, res) => {
        const { reviewid } = req.params
        const user = req.user.id
        const theReview = await Review.findOne({ where: { id: reviewid } })

        if (!theReview) {
            let er = new Error("Review couldn"t be found")
            er.status = 404
            throw er
        } else if (theReview.userId !== user) {
            const err = new Error("Forbidden");
            err.status = 403
            throw err
        }

        else {
            await theReview.destroy()

            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })
        }

    })



module.exports = router;