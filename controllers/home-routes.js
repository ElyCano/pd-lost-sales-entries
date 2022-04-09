const router = require("express").Router();
const sequelize = require("../config/connection");
const { Missed, User, Vote, Comment } = require("../models");

// Get all missed sales render homepage
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
    .then((dbMissedData) => {
      const misses = dbMissedData.map((missed) => missed.get({ plain: true }));
      res.render("homepage", {
        misses,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Login
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

// Signup
// router.get('/signup', (req, res) => {
//   if (req.session.loggedIn) {
//     res.redirect('/');
//     return;
//   }
//   res.render('signup');
// });

// Get all Misses for /missed extension
// router.get('/missed', (req, res) => {
//   Missed.findAll({
//       attributes: [
//           'id',
//           'name',
//"pd_location",
//           'item_category',
//           'wedding_date',
//           'platform_place',
//           'user_id',
//           'notes',
//           [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE missed.id = vote.missed_id)'), 'vote_count']
//       ],
//       include: [
//         {
//           model: Comment,
//           attributes: ['id', 'comment_text', 'missed_id', 'user_id', 'created_at'],
//           include: {
//             model: User,
//             attributes: ['username']
//           }
//         },
//         {
//           model: User,
//           attributes: ['username']
//         }
//       ]
//     })
//       .then(dbMissedData => {
//         const misses = dbMissedData.map(missed => missed.get({ plain: true }));
//         res.render('missed', {
//             misses,
//             loggedIn: req.session.loggedIn
//           });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//       });
// });

// Get all Misses for /browse (for future development)
// router.get('/browse', (req, res) => {
//   Missed.findAll({
//       attributes: [
//         'id',
//         'name',
// "pd_location",
//         'item_category',
//         'wedding_date',
//         'platform_place',
//         'user_id',
//         'notes',
//         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE missed.id = vote.missed_id)'), 'vote_count']
//       ],
//       include: [
//         {
//           model: Comment,
//           attributes: ['id', 'comment_text', 'missed_id', 'user_id', 'created_at'],
//           include: {
//             model: User,
//             attributes: ['username']
//           }
//         },
//         {
//           model: User,
//           attributes: ['username']
//         }
//       ]
//     })
//       .then(dbMissedData => {
//         const misses = dbMissedData.map(missed => missed.get({ plain: true }));
//         res.render('browse', {
//             misses,
//             loggedIn: req.session.loggedIn
//           });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//       });
// });

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
