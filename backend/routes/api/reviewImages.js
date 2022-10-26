const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, sequelize, SpotImage, Sequelize, DataTypes } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const queryInterface = sequelize.getQueryInterface();

const router = express.Router();

////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

router.delete('/:imageid',
    requireAuth,
    async (req, res) => {
        const { imageid } = req.params
        const user = req.user.id
        const theimage = await ReviewImage.findOne({ where: { id: imageid } })

        if (!theimage) {
            let er = new Error('Review Image couldn`t be found')
            er.status = 404
            throw er
        }
        const thereview = await Review.findOne({ where: { id: theimage.reviewId } })

        if (user !== thereview.userId) {
            const err = new Error('Forbidden');
            err.status = 403
            throw err
        }
        else {
            await theimage.destroy()

            res.json({
                'message': 'Successfully deleted',
                'statusCode': 200
            })
        }

    })



module.exports = router;