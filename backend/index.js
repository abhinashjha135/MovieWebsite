const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/config');
const mongoose=require('mongoose');
const User = require("./db/User");
const Movies=require("./db/Movies");
app.use(express.json());
app.use(cors())
const jwt = require('jsonwebtoken');
const jwtKey = "movieWebsiteLaxmi";
connectDB()
app.get("/", async (req, resp) => {

    resp.send("avinash");

})
app.post("/register", async (req, resp) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            // If user with the same email already exists
            return resp.status(400).json({ message: 'Email already registered' });
        }

        let user = new User(req.body);
        user = await user.save();
        user = user.toObject();
        resp.status(201).json({ user });
    } catch (error) {
        // If any error occurs during registration
        console.error('Error during registration:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/movies/add', async (req, res) => {
    try {
        const { title, director, genre, releaseYear, description } = req.body;

        // Check if the required fields are provided
        if (!title || !director || !genre || !releaseYear) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new movie instance
        const movie = new Movies({
            title,
            director,
            genre,
            releaseYear,
            description
        });

        // Save the movie to the database
        const newMovie = await movie.save();

        // Respond with the newly created movie
        res.status(201).json({ movie: newMovie });
    } catch (error) {
        console.error('Error while adding movie:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Assuming you have already required express and defined the Movie model

// Update Movie route
app.put('/movies/update/:id', async (req, res) => {
    const { id } = req.params;
    const { title, director, genre, releaseYear, description } = req.body;

    try {
        // Validate if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        // Find the movie by its ID and update its details
        const updatedMovie = await Movies.findByIdAndUpdate(id, {
            title,
            director,
            genre,
            releaseYear,
            description
        }, { new: true });

        if (!updatedMovie) {
            // If no movie found with the provided ID
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Return the updated movie
        res.status(200).json({ movie: updatedMovie });
    } catch (error) {
        // If any error occurs during movie update
        console.error('Error updating movie:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.delete('/movies/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Validate if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        // Find the movie by its ID and delete it
        const deletedMovie = await Movies.findByIdAndDelete(id);

        if (!deletedMovie) {
            // If no movie found with the provided ID
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Return a success message
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        // If any error occurs during movie deletion
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get Movie Details route
app.get('/movies/getMovies/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }
        const movie = await Movies.findById(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ movie });
    } catch (error) {
        console.error('Error retrieving movie:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/movies/query', async (req, res) => {
    try {
        let query = {};
     
        // Filter by genre, if provided
        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        // Filter by releaseYear, if provided
        if (req.query.releaseYear) {
            query.releaseYear   = req.query.releaseYear;
        }

        // Filter by director, if provided
        if (req.query.director) {
            query.director = req.query.director;
        }

        // Find movies based on the provided query
        const movies = await Movies.find(query);

        // Return the list of movies
        res.status(200).json({ movies });
    } catch (error) {
        // If any error occurs during movie listing
        console.error('Error listing movies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/movies/:movieId/addRateAndReviews/:userId', async (req, res) => {
    try {
        const { movieId,userId } = req.params;
       
        const { rating, reviews } = req.body;
       
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        // Check if the required fields are provided
        if (!rating || !reviews|| !userId) {
            return res.status(400).json({ message: 'Rating, review and authentic user required ' });
        }

        const movie = await Movies.findById(movieId);

        // If no movie found with the provided ID
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Save the review to the movie
        movie.rateAndReviews.push({ rating, reviews,userId });
        await movie.save();

        // Respond with the updated movie
        res.status(201).json({ movie });
    } catch (error) {
        // If any error occurs during the process
        console.error('Error while posting review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/movies/:movieId/updateRateAndReviews/:userId', async (req, res) => {
    try {
        const { movieId, userId } = req.params;
        const { rating, reviews } = req.body;

        // Check if the provided movie ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        // Check if the provided review ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        // Find the movie by its ID
        const movie = await Movies.findById(movieId);

        // If no movie found with the provided ID
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const rateAndReviewIndex = movie.rateAndReviews.findIndex(x => userId==x.userId);

        // If no review found with the provided ID
        if (rateAndReviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        movie.rateAndReviews[rateAndReviewIndex].rating = rating || movie.rateAndReviews[rateAndReviewIndex].rating;
        movie.rateAndReviews[rateAndReviewIndex].reviews = reviews || movie.rateAndReviews[rateAndReviewIndex].reviews;

        // Mark the movie object as modified
        movie.markModified('rateAndReviews');


        // Save the updated movie
        await movie.save();

        // Respond with the updated review
        res.status(200).json({ movie });
    } catch (error) {
        // If any error occurs during the process
        console.error('Error while updating review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/movies/:movieId/deleteRateAndReviews/:userId/:reviewId', async (req, res) => {
    try {
        const { movieId, userId, reviewId} = req.params;

        // Check if the provided movie ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        // Check if the provided review ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        // Find the movie by its ID
        const movie = await Movies.findById(movieId);

        // If no movie found with the provided ID
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Find the index of the review within the movie's reviews array
        const reviewIndex = movie.rateAndReviews.findIndex(x=>x.userId==userId&&x._id==reviewId);

        // If no review found with the provided ID
        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
        }

        movie.rateAndReviews.splice(reviewIndex, 1);

        // Save the updated movie
        await movie.save();

        // Respond with a success message
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        // If any error occurs during the process
        console.error('Error while deleting review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/movies/:movieId/reviews', async (req, res) => {
    try {
        const movieId = req.params.movieId;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        const movie = await Movies.findById(movieId);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Respond with the reviews of the movie
        res.status(200).json({ reviews: movie.rateAndReviews });
    } catch (error) {
        // If any error occurs during the process
        console.error('Error while retrieving reviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/movies/:movieId/averageRating', async (req, res) => {
    try {
        const movieId = req.params.movieId;

        // Check if the provided movie ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        // Find the movie by its ID
        const movie = await Movies.findById(movieId);

        // If no movie found with the provided ID
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Calculate the average rating for the movie
        let totalRating = 0;
        movie.rateAndReviews.forEach(review => {
            totalRating += review.rating;
        });
        const averageRating = totalRating / movie.rateAndReviews.length;

        // Respond with the average rating
        res.status(200).json({ averageRating });
    } catch (error) {
        // If any error occurs during the process
        console.error('Error while calculating average rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.listen(5000)