const knex = require("../db/connection");
const addCritics = require("../utils/addCritics");

function list() {
  return knex("reviews").select("*");
}

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function readReviewCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "r.review_id": review_id })
    .then(addCritics);
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  list,
  read,
  readReviewCritic,
  update,
  delete: destroy,
};
