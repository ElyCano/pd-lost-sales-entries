const router = require("express").Router();
const sequelize = require("../config/connection");
const { Missed, User, Vote, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Get all missed sales for /inventory
router.get("/", withAuth, (req, res) => {
  console.log(req.session);
  Missed.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: [
      "id",
      "name",
      "pd_location",
      "item_category",
      "wedding_date",
      "platform_place",
      "notes",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE missed.id = vote.missed_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: [
          "id",
          "comment_text",
          "missed_id",
          "user_id",
          "created_at",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbMissedData) => {
      const misses = dbMissedData.map((missed) => missed.get({ plain: true }));
      res.render("inventory", { misses, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get single missed sale by ID
router.get("/missed/:id", (req, res) => {
  Missed.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "name",
      "pd_location",
      "item_category",
      "wedding_date",
      "platform_place",
      "notes",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE missed.id = vote.missed_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: [
          "id",
          "comment_text",
          "missed_id",
          "user_id",
          "created_at",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbMissedData) => {
      if (!dbMissedData) {
        res.status(404).json({ message: "No missed found with this id" });
        return;
      }

      const missed = dbMissedData.get({ plain: true });

      res.render("single-missed", {
        missed,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
