const mongoose = require('mongoose');
const cities = require('./cities')
const Homie = require('../models/homies');
const { names, descriptors } = require('./seedHelpers');



mongoose.connect('mongodb://localhost:27017/homie-hookup', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const status = ['Down to party', 'Locked up', 'On a sick one', 'Nah', 'I\'m out the game', ''];

const occupation = ['Dopeboy', 'Day job', 'Hustler', 'Moms is taking care of me', 'unemployed', 'Don\'t worry about it']

const gender = ['Male', 'Female'];

// const result = getRandomStatus(status);

const sample = array => array[Math.floor(Math.random() * array.length)];
//ramdomize selection of staus options in array

const seedDb = async () => {
    await Homie.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const age = Math.floor(Math.random() * (50 - 18) + 18);

        const homie = new Homie({
            name: `${sample(descriptors)} ${sample(names)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: ['https://images.unsplash.com/photo-1615224102010-e9410976df41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80', 'https://images.unsplash.com/photo-1626770567359-e8c7366d59a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'],
            age: `${age}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            status: `${sample(status)}`,
            occupation: `${sample(occupation)}`,
            gender: `${sample(gender)}`
        })
        await homie.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close()
});