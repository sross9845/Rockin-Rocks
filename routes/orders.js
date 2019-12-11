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
                prodId: req.body.prodId,
                title: req.body.title,
                price: req.body.price,
                image: req.body.image
            })
            newOrder.save()
            res.send(newOrder)
        }else {
            order.products.push({
                prodId: req.body.prodId,
                title: req.body.title,
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

router.get('/current/:uid', (req,res) => {
    Order.findOne({userId: req.params.uid, completed: false}, (err, order) => {
        res.json(order)
    })
})

router.put('/submit/:uid', (req,res) => {
    Order.findOneAndUpdate({userId: req.params.uid, completed: false}, {
        completed: req.body.completed
    }, (err,order) =>{
        if(err){
            res.send(err)
        }
    })
})

router.get('/removeitem/:uid/:pid', (req,res) => {
    var id = req.params.pid
    Order.findOne({userId: req.params.uid, completed: false}, (err, order) => {
        order.products.forEach(element => {
            if(element.prodId == id || element._id == id ){
                element.remove()
            }
            order.save()
            console.log(element._id)
        })
        res.json(order)
    })
})

router.get('/all/:uid', (req,res) => {
    Order.find({userId: req.params.uid, completed: true}, (err,orders) => {
        res.send(orders)
    })
})


module.exports = router