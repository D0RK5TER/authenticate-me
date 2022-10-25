const router = require("express").Router();
const sessionRouter = require("./session.js")
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js")
const reviewsRouter = require("./reviews.js")
const bookingsRouter = require("./bookings.js")
const spotImagesRouter = require("./spotImages")
const reviewImagesRouter = require("./reviewImages")

const { restoreUser } = require("../../utils/auth.js");
const { setTokenCookie } = require("../../utils/auth.js");
const { User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");


router.use(restoreUser);

router.get(
    "/restore-user",
    (req, res) => {
        return res.json(req.user);
    }
);
router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);
router.use("/bookings", bookingsRouter);
router.use("/spot-images", spotImagesRouter);
router.use("/review-images", reviewImagesRouter);


router.post("/test", (req, res) => {
    res.json({ requestBody: req.body });
});
// router.get("/test", function (req, res) {
//     res.json({ requestBody: req.body });
// });
// router.post("/test", function (req, res) {
//     res.json({ requestBody: req.body });
// });
// GET / api / set - token - cookie

router.get("/set-token-cookie", async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: "Demo-lition"
        }
    });
    setTokenCookie(res, user);
    return res.json({ user });
});
// GET / api / restore - user



// GET / api / require - auth
router.get(
    "/require-auth",
    requireAuth,
    (req, res) => {
        return res.json(req.user);
    }
);

module.exports = router;