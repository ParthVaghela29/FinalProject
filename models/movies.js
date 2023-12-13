// models/Movie.js
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId,
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: {
    $date: {
      $numberLong: String 
    }
  },
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String,
  },
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number,
  },
  countries: [String],
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number,
      fresh: Number,
    },
    critic: {
      rating: Number,
      numReviews: Number,
      meter: Number,
      rotten: Number,
      lastUpdated: String,
    },
  },
  num_mflix_comments: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
