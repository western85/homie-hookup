const express = require('express');
const mongoose = require('mongoose');

const app = express();
const path = require('path')

mongoose.connect('mongodb://localhost:27017/homie-hookup',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MONGO connection is open!')
})
.catch(err => {
    console.log("Yikes- MONGO connection error!")
    console.log(err)
})

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'/views'));

app.get('/', (req, res) => {
    res.render('home',)
});



app.listen(3000, () => {
    console.log('Now listening on port 3000')
});