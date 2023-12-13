// db.js
const mongoose = require("mongoose");
const Movie = require("../models/movies");

const db = {
  initialize: (connectionString) => {
    return mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  //   addNewMovie: (data) => {
  //     const newMovie = new Movie(data);
  //     return newMovie.save();
  //   },
  addNewMovie: (data) => {
    // Check if _id is provided in the data
    if (!data._id) {
      // If _id is not provided, remove it to let MongoDB generate a new one
      delete data._id;
    }
    console.log("Data received:", data);
    const newMovie = new Movie(data);
    return newMovie.save();
  },

  getAllMovies: async (page = 1, perPage = 10, title = "") => {
    const query = {};

    // If a title is provided, add it to the query for filtering
    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }

    try {
      const movies = await Movie.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage);

      return movies;
    } catch (error) {
      throw error;
    }
  },

  getMovieById: (Id) => {
    return Movie.findById(Id);
  },

  updateMovieById: (data, Id) => {
    return Movie.findByIdAndUpdate(Id, data, { new: true });
  },

  deleteMovieById: (Id) => {
    return Movie.findByIdAndDelete(Id);
  },
};

module.exports = db;
