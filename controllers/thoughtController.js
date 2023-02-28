/** @format */

const { Thought, User } = require("../models");

module.exports = {
  //get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },

  //get thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.userId })
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  //create thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought created, but no user found with that ID",
            })
          : res.json("Thought created")
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  //update thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      {
        _id: req.params.thoughtId,
      },
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  //delete thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought with that ID" });
        }
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $pull: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then(() => res.json({ message: "Thought deleted" }))
      .catch((err) => res.status(500).json(err));
  },

  //add reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //delete reaction
  deleteReaction(req, res) {
    Thought.findOneAndDelete(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No friend found with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
