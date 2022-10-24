const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, sequelize } = require('../../db/models');
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


router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        let user = await User.login({ credential, password });

        if (!user) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = ['The provided credentials were invalid.'];
            return next(err);
        }

        await setTokenCookie(res, user);

        // let newUser = {}
        // for (let x in user) {
        //     if (x == 'updatedAt') continue
        //     newUser.x = x
        // }
        // console.log(newUser)
        user = await User.findByPk(user.id, {
            attributes: {
                include: ['id', 'firstName', 'lastName', 'email', "username"]
            }
            // include: ['id', 'firstName', 'lastName', 'email', "username"],
            // attributes: {'token': ''}s
            // include:  [ [
            //     sequelize.col("SpotImages.url"),
            //     'previewImage'
            // ]]
            ,
            // include: [User.token]
        })
        // await user.add('token')
        // user.token = ''
        // await user.save()
        // console.log('1239829837129837912873s', user.token)
        // return res.json(user);
        return res.json(user);
    }
);

router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);
router.get(
    '/',
    restoreUser,
    async (req, res) => {
        const { user } = req;
        if (user) {
            // user.attributes = { excludew: ['email'] }
            const NEWuser = await User.findOne({
                where: { id: user.id },
                attributes: {
                    include: ['email']
                }
            });
            return res.json(NEWuser);
        } else return res.json({});
    }
);



module.exports = router;