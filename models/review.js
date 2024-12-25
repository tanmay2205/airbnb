const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String
    },
    rating: {
        type: Number,
        min: 1, // Minimum rating
        max: 5  // Maximum rating
    },
    createdAt: {
        type: Date,
        default: Date.now // Automaticall y set to the current date and time
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
