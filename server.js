require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const expressJWT = require('express-jwt')
const helmet = require('helmet')
const cors = require('cors')
const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(helmet())
app.use(cors())
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.once('open', () => {
    console.log(`connected to MongoDb on ${db.host}:${db.port}...`)
})
db.on('error', (err) => {
    console.log(`Database Error:\n ${err}`)
})

app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))
app.use('/orders', require('./routes/orders'))
app.use('/products', require('./routes/products'))
app.use('/locked',
    expressJWT({secret: process.env.JWT_SECRET}).unless({method: 'POST'}),
    require('./routes/locked'))

    // app.get('/*', (req, res) => {
    //     res.sendFile(__dirname + '/client/public/index.html');
    //   });
app.listen(process.env.PORT, () => {
    console.log(`you are listening to the sweet sounds of port ${process.env.PORT}`)
})
