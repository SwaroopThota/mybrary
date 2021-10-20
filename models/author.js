const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
authorSchema.pre('remove', function(next){
    Book.find({author: this.id })
    .then((books)=>{
        if(books.length > 0) 
        next(new Error('This author has books'));
        else 
        next();
    })
    .catch((err)=>{
        next(err);
    })
})

module.exports = new mongoose.model('Author', authorSchema);