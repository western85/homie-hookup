const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Homie = require('./models/homies');

mongoose.connect('mongodb://localhost:27017/homie-hookup', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/homies', async (req, res) => {
    const homies = await Homie.find({});
    res.render('homies/index', { homies })
})

app.get('/homies/new', (req, res) => {
    res.render('homies/new');
})

app.post('/homies', async (req, res) => {
    const homie = new Homie(req.body.homie)
    await homie.save()
    res.redirect(`/homies/${homie._id}`)
})

app.get('/homies/:id', async (req, res) => {
    const homie = await Homie.findById(req.params.id)
    res.render('homies/show', { homie })
});

app.get('/homies/:id/edit', async (req, res) => {
    const homie = await Homie.findById(req.params.id)
    res.render('homies/edit', { homie })
});


app.listen(3000, () => {
    console.log('Now listening on port 3000')
});