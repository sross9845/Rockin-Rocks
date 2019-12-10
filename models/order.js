const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// const Rock = require('./rock')

var productSchema = new mongoose.Schema({
    prodId: String,
    title: String,
    price: Number,
    image: String
})

var orderSchema = new mongoose.Schema({
    userId: String,
    products:[productSchema],
    totalPrice: Number,
    completed: Boolean
});

module.exports = mongoose.model('Order', orderSchema);


