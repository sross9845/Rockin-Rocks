const mongoose = require('mongoose')


var rockSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    rating: Number
})

module.exports = mongoose.model('Rock', rockSchema);
