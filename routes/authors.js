const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

router.get('/', async (req, res) => {
    const searchOptions = {};
    if(req.params.name !== null || req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name,'i');
    }
    try{
        const authors = await Author.find(searchOptions);
        res.render('./authors/index',{ authors: authors, searchOptions: req.query.name});
    }catch(err){
        res.render('./authors',{ authors: [], searchOptions: req.query, error: err});
    }
})
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try{
        await author.save();
        res.redirect('/authors');
    }catch(err){
        res.render('./authors/new', { author: author , error: "Error Creating Author" });
    }
})
router.get('/new',(req, res) => {
    res.render('./authors/new', { author: new Author() });
})
router.get('/:id', async (req, res) => {
     try {
         const books = await Book.find({author: req.author.id }).limit(10).exec();
         res.render('./authors/showAuthor', { author: req.author, booksByAuthor: books });

     } catch (err) {
         console.log(err);
         res.redirect('/authors');
     }
})
router.get('/:id/edit',(req, res) => {
    res.render('./authors/edit', { author: req.author});
})
router.put('/:id', async (req, res) => {
    try{
        await Author.findByIdAndUpdate(req.author.id, { $set:{name: req.body.name }});
        res.redirect(`${req.params.id}`);
    }catch(err){
        console.log(err);
        res.render(`/${req.params.id}/edit`,{author: req.author,error: 'Error updating author'});
    }
})
router.delete('/:id',async (req, res) => {
    try{
        await req.author.remove();
        res.redirect('/authors');
    }catch(err){
        console.log(err);
        res.redirect(`/authors/${req.params.id}`);
    }
})
router.param('id',async (req,res,next,id)=>{
    try {
        const author = await Author.findById(id);
        req.author = author;
    } catch (err) {
        console.log(err);
    }
    next();
})
module.exports = router;