const express = require('express');
const router = express.Router();
const Author = require('../models/author');

router.use(express.urlencoded({ extended: true }));
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
router.get('/new',(req, res) => {
    res.render('./authors/new', { author: new Author() });
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
module.exports = router;