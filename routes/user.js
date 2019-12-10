const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/:id', (req,res) => {
    User.findOne({_id:req.params.id}, (err, user) => {
        if(user){
            res.send(user)
        }else if(err){
            console.log('--------------------------------------')
            console.log(err)
        }
    })
})

router.post('/edit', (req, res) => {
    var myObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        zipCode: req.body.zipCode,
        state: req.body.state,
    }
    User.findByIdAndUpdate(req.body.id, myObj, (err, user) => {
        if (user) {
            console.log(`===================== This is the User: ${user}`)
            res.json(user)
        }
    })
})

module.exports = router