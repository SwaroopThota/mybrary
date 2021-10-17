if(process.env.NODE_ENV !== 'production')
    require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const port = process.env.PORT || 3000;
const authorsRouter = require('./routes/authors');

const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout','layouts/layout')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/authors',authorsRouter);

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;
db.on('error', err =>console.error(err));
db.once('open',()=>{console.log("Connected to MongoDB successfully")})

app.get('/',(req, res) =>{
    res.render('index');
})

app.listen(port , () => {console.log(`Server is listening at http://localhost:${port}`);})