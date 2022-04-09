const router = require("express").Router();

const userRoutes = require("./user-routes");
const missedRoutes = require("./missed-routes");
const commentRoutes = require("./comment-routes");

router.use("/users", userRoutes);
router.use("/comments", commentRoutes);
router.use("/missed", missedRoutes);

module.exports = router;
