const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, sequelize, SpotImage, Sequelize, DataTypes } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const queryInterface = sequelize.getQueryInterface();

const router = express.Router();



router.delete("/:spotimageid",
    requireAuth,
    async (req, res) => {
        const { spotimageid } = req.params
        const user = req.user.id
        const theimage = await SpotImage.findOne({ where: { id: spotimageid } })
        if (!theimage) {
            let er = new Error("Review Image couldn't be found")
            er.status = 404
            throw er
        }
        const spat = await Spot.findByPk(theimage.spotId)
        if (user !== spat.ownerId) {
            const err = new Error("Forbidden");
            err.status = 403
            throw err
        } else {
            await theimage.destroy()

            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })
        }

    })



module.exports = router;