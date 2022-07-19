const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Homie = require('./models/homies');
const passport = require('passport');
const User = require('./models/user');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const LocalStrategy = require('passport-local');
const session = require('express-session');
// const flash = require('connect-flash');


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

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/homies', catchAsync(async (req, res) => {
    const homies = await Homie.find({});
    res.render('homies/index', { homies })
}))

app.get('/homies/new', (req, res) => {
    res.render('homies/new');
})

app.post('/homies', async (req, res) => {
    const homie = new Homie(req.body.homie)
    await homie.save()
    res.redirect(`/homies/${homie._id}`)
})

app.get('/homies/:id', catchAsync(async (req, res) => {
    const homie = await Homie.findById(req.params.id)
    res.render('homies/show', { homie })
}));

app.get('/homies/:id/edit', catchAsync(async (req, res) => {
    const homie = await Homie.findById(req.params.id)
    res.render('homies/edit', { homie })
}));

app.all('*', (req, res) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    res.send('Yikes, something went wrong!')
    console.log(err.stack)
})

app.listen(3000, () => {
    console.log('Now listening on port 3000')
});