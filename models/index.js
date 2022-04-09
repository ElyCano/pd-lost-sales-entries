const User = require("./User-Model");
const Missed = require("./Missed-Model");
const Comment = require("./Comment-Model");
const Vote = require("./Vote-Model");

User.hasMany(Missed, {
  foreignKey: "user_id",
});

Missed.belongsTo(User, {
  foreignKey: "user_id",
});

User.belongsToMany(Missed, {
  through: Vote,
  as: "voted_missed",
  foreignKey: "user_id",
});

Missed.belongsToMany(User, {
  through: Vote,
  as: "voted_missed",
  foreignKey: "missed_id",
});

Vote.belongsTo(User, {
  foreignKey: "user_id",
});

Vote.belongsTo(Missed, {
  foreignKey: "missed_id",
});

User.hasMany(Vote, {
  foreignKey: "user_id",
});

Missed.hasMany(Vote, {
  foreignKey: "missed_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});
Comment.belongsTo(Missed, {
  foreignKey: "missed_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
});

Missed.hasMany(Comment, {
  foreignKey: "missed_id",
});

module.exports = { User, Missed, Vote, Comment };
