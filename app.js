const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Homie = require('./models/homies');
const passport = require('passport');
const User = require('./models/user');
const catchAsync = require('./utils/catchAsync');
const session = require('express-session');
const Joi = require('joi');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const LocalStrategy = require('passport-local');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { homieSchema } = require('./schemas.js');
const userRoute = require('./routes/users');
const { use } = require('passport');
const homies = require('./models/homies');
const { isLoggedIn } = require('./middleware');


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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'excellentpw!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', userRoute)

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'larry@larry.larry', username: 'Larry' });
//     const newUser = await User.register(user, 'larry')
//     res.send(newUser);
// })




const validateHomie = (req, res, next) => {
    const { error } = homieSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/homies', catchAsync(async (req, res) => {
    const homies = await Homie.find({});
    res.render('homies/index', { homies })
}))

app.get('/homies/new', isLoggedIn, (req, res) => {
    res.render('homies/new');
})

app.post('/homies', isLoggedIn, validateHomie, catchAsync(async (req, res, next) => {

    const homie = new Homie(req.body.homie)
    await homie.save()
    req.flash('success', 'Successfully added a new homie')
    res.redirect(`/homies/${homie._id}`)
}));

app.get('/homies/:id', catchAsync(async (req, res) => {
    const homie = await Homie.findById(req.params.id)
    res.render('homies/show', { homie })
}));

app.get('/homies/:id/edit', catchAsync(async (req, res) => {
    const homie = await Homie.findById(req.params.id)
    res.render('homies/edit', { homie })
}));

app.delete('/homies/:id', async (req, res) => {
    const { id } = req.params;
    await Homie.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted homie');
    return res.redirect('/homies');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Sike- Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Now listening on port 3000')
});