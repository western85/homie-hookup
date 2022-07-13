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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Homie.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const homie = new Homie({
            name: `${sample(descriptors)} ${sample(names)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await homie.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close()
});