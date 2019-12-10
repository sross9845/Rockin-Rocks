const express = require('express')
const router = express.Router()
const Rock = require('../models/rock')

router.post('/add', (req, res) => {
    let product = new Rock(req.body)
    product.save()
    res.send(product)
})

router.put('/update/:pid', (req,res) => {
    Rock.findByIdAndUpdate(req.params.pid,  req.body,{new: true}, (err, rock) => {
            if (err) return res.status(500).send(err);
            return res.send(rock);
    })
})
router.get('/all', (req,res) => {
    Rock.find((err,rocks) => {
        res.send(rocks)
    })
})

module.exports = router