const mongoose = require('mongoose');
const Rock = require('./models/rock')

const rocks = [
    {
        title: 'Doughnut Rock',
        description: 'Doughnuts not included',
        price: 10,
        image: 'https://i.imgur.com/TfcYHCY.jpg',
        rating: 4
    },
    {
        title: 'Steve',
        description: 'Cool guy, cooler rock',
        price: 5,
        image: 'https://i.imgur.com/vW0l1Bh.jpg',
        rating: 4
    },
    {
        title: 'Baby Yoda',
        description: 'The cutest rock, he is',
        price: 10,
        image: 'https://i.imgur.com/jc1hhgY.jpg',
        rating: 5
    },
    {
        title: 'The Rock',
        description: 'Literally the rock',
        price: 20,
        image: 'https://pbs.twimg.com/media/DSvQogQVAAAgD5T.png',
        rating: 5
    },
    {
        title: 'Cute Rock',
        description: 'Just a normal cute rock',
        price: 6,
        image: 'https://images-na.ssl-images-amazon.com/images/I/81qrQKsC85L.png',
        rating: 3.5
    },
    {
        title: 'Mustache Rock',
        description: 'I mean he has a mustache',
        price: 7,
        image: 'https://live.staticflickr.com/6137/6025736265_8442422561_b.jpg',
        rating: 4.2
    }
    
  ];

function seedRocks() {  
    rocks.forEach((rock, index) => {
      Rock.create(rock)
        .then(newRock=> {
          return newRock.save();
        });
    });
  }
  mongoose.connect('mongodb://127.0.0.1/project-4', { useNewUrlParser: true });
  mongoose.connection.once('open', () => {
    console.log('connected to MongoDB database in seed file');
    return seedRocks();
  });