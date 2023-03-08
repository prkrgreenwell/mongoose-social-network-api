/** @format */

const router = require("express").Router();

const {
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

router.route("/").get(getAllThoughts);

router.route("/:userId").post(createThought);

router
  .route("/:userId/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought)
  .post(addReaction);

router.route(":userId/:thoughtId/:reactionId").delete(deleteReaction);

module.exports = router;
