const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// LIST
async function list(req, res) {
  const data = await reviewsService.list();
  res.json({ data });
}

// READ
async function read(req, res) {
  const { review } = res.locals;
  const data = await reviewsService.read(review.review_id);
  res.json({ data });
}

// UPDATE
async function update(req, res, next) {
  const { review } = res.locals;
  const updatedReview = {
    ...req.body.data,
    // make sure ids stay the same when doing PUT
    review_id: review.review_id,
    critic_id: review.critic_id,
    movie_id: review.movie_id
  };
  // update review
  let data = await reviewsService.update(updatedReview);
  // put response in correct format
  data = await reviewsService.readReviewCritic(review.review_id);
  res.json({ data: data[0] });
}

// DELETE
async function destroy(req, res) {
  const { review } = res.locals;
  await reviewsService.delete(review.review_id);
  res.sendStatus(204);
}

// VALIDATION
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const validReview = await reviewsService.read(reviewId);

  if (validReview) {
    res.locals.review = validReview;
    return next();
  } else {
    return next({
      status: 404,
      message: "Review cannot be found",
    });
  }
}

function hasValidReviewScore(req, res, next) {
  const {
    data: { score },
  } = req.body;

  if (score < 1 || score > 5) {
    return next({
      status: 400,
      message: "Score must have a value between 1 and 5",
    });
  } else {
    next();
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reviewExists),
    hasValidReviewScore,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
