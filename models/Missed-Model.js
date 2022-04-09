const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const { truncate } = require("./User-Model");

// create our Post model
class Missed extends Model {
  static uplike(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      missed_id: body.missed_id,
    }).then(() => {
      return Missed.findOne({
        where: {
          id: body.missed_id,
        },
        attributes: [
          "id",
          "name",
          "pd_location",
          "item_category",
          "wedding_date",
          "platform_place",
          "user_id",
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM vote WHERE missed.id = vote.missed_id)"
            ),
            "vote_count",
          ],
        ],
      });
    });
  }
}

// create fields/columns for Post model
Missed.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // We talked about limiting the number of preselected...will need to work in to code
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pd_location: {
      type: DataTypes.TEXT,
      allowNull: truncate,
    },
    item_category: {
      type: DataTypes.TEXT,
      allowNull: truncate,
    },
    wedding_date: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    platform_place: {
      type: DataTypes.TEXT,
      alllowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "missed",
  }
);

module.exports = Missed;
