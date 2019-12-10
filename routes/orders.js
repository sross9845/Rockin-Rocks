const express = require('express')
const router = express.Router()
const Order = require('../models/order')

router.post('/addproduct', (req, res) => {
    Order.findOne({userId: req.body.user_id, completed: false}, (err, order) => {
        if(!order){
            var newOrder = new Order({
                userId: req.body.user_id,
                totalPrice: req.body.price,
                completed: false,
                products:[]
            })
            newOrder.products.push({
                title: req.body.name,
                price: req.body.price,
                image: req.body.image
            })
            newOrder.save()
            res.send(newOrder)
        }else {
            order.products.push({
                title: req.body.name,
                price: req.body.price,
                image: req.body.image
            })
            order.save()
            res.send(order)
        }
        if(err){
            console.log('----------------------------------')
            console.log(err)
        }
    })
})

router.get('/current', (req,res) => {
    Order.findOne({userId: req.body.user_id, completed: false}, (err, order) => {
        res.send(order)
    })
})

router.put('/submit', (req,res) => {
    Order.findOneAndUpdate({userId: req.body.user_id, completed: false}, req.body, (err,order) => {
        if(err){
            res.send(err)
        }
        order.save()
    })
})

router.get('/all', (req,res) => {
    Order.find({userId: req.body.user_id}, (err,orders) => {
        res.send(orders)
    })
})


module.exports = router