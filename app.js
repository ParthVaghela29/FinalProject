// app.js
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const exphbs = require("express-handlebars");
const path = require("path");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

//handlebar
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

app.set("view engine", "hbs");

// Routes
app.post("/api/Movies", async (req, res) => {
  try {
    const newMovie = await db.addNewMovie(req.body);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the /api/Movies route
app.get("/api/Movies", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    const title = req.query.title || "";

    const movies = await db.getAllMovies(page, perPage, title);
    res.render("movie", { data: movies }); // Pass the entire movies array to the movie view
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/Movies/:id", async (req, res) => {
  try {
    const movie = await db.getMovieById(req.params.id);
    res.render("movie", movie); // Render the movie view with Handlebars
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/Movies/:id", async (req, res) => {
  try {
    const updatedMovie = await db.updateMovieById(req.body, req.params.id);
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/Movies/:id", async (req, res) => {
  try {
    await db.deleteMovieById(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new route for the form
app.get("/movies/form", (req, res) => {
  res.render("movieForm");
});

// Handle form submission
app.post("/movies/search", async (req, res) => {
  try {
    // const page = req.body.page || 1;
    // const perPage = req.body.perPage || 5;
    // const title = req.body.title || "";
    const page = parseInt(req.body.page, 10) || 1;
    const perPage = parseInt(req.body.perPage, 10) || 10;
    const title = req.body.title || "";

    const movies = await db.getAllMovies(page, perPage, title);
    res.render("movie", { data: movies, searchTitle: title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/api/secureRoute", verifyToken, (req, res) => {
  // This route is only accessible with a valid JWT token
  res.json({ message: "You are authorized to access this route." });
});

// Start the server
db.initialize(
  "mongodb+srv://rdpatel9998:admin@cluster0.qsyjn8p.mongodb.net/sample_mflix?retryWrites=true&w=majority"
)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
