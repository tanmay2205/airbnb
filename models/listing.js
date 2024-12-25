const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require("./review.js")
const { ref, string } = require('joi')

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: Schema.Types.Mixed, // Allows both strings and objects
        default: {
            url: "https://images.unsplash.com/photo-1720247524055-49f9aba85885?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "defaultImage"
        },
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1720247524055-49f9aba85885?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["mountains","arctic", "farms" ,"camping" ]

    }
})


listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})

    }
})



const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing