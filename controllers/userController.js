/** @format */

const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user by id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({
              _id: {
                $in: user.thoughts,
              },
            })
      )
      .then(() =>
        res.json({ message: "User and associated thoughts deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add a friend
  addFriend(req, res) {
    console.log("You are adding a friend");

    User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $addToSet: {
          friends: req.params.friendsId,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No friend found with that Id" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $pull: {
          friends: req.params.friendsId,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No friend found with that Id" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
