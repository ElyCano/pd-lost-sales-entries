const router = require("express").Router();
const { User, Missed, Comment, Vote } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

// Get all missed sales
router.get("/", (req, res) => {
  Missed.findAll({
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
    .then((dbMissedData) => res.json(dbMissedData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get single missed sale by ID
router.get("/:id", (req, res) => {
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
        model: User,
        attributes: ["username"],
      },
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
    ],
  })
    .then((dbMissedData) => {
      if (!dbMissedData) {
        res.status(404).json({ message: "No missed found with this id" });
        return;
      }
      res.json(dbMissedData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Post Missed
router.post("/", withAuth, (req, res) => {
  Missed.create({
    name: req.body.name,
    pd_location: req.body.pd_location,
    item_category: req.body.item_category,
    wedding_date: req.body.wedding_date,
    platform_place: req.body.platform_place,
    notes: req.body.notes,
    user_id: req.session.user_id,
  })
    .then((dbMissedData) => res.json(dbMissedData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Missed sale voting route
router.put("/uplike", withAuth, (req, res) => {
  if (req.session) {
    Missed.uplike(
      { ...req.body, user_id: req.session.user_id },
      { Vote, Comment, User }
    )
      .then((updatedVoteData) => res.json(updatedVoteData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

// Update Missed
// router.put('/:id', withAuth, (req, res) => {
//     Missed.update(req.body, {
//         individualHooks: true,
//         where: {
//             id: req.params.id
//       }
//     })
//       .then(dbMissedData => {
//         if (!dbMissedData[0]) {
//           res.status(404).json({ message: 'No missed found with this id' });
//           return;
//         }
//         res.json(dbMissedData);
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//       });
// });

// Delete Missed Sale Entry
router.delete("/:id", withAuth, (req, res) => {
  Missed.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbMissedData) => {
      if (!dbMissedData) {
        res.status(404).json({ message: "No missed found with this id" });
        return;
      }
      res.json(dbMissedData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
