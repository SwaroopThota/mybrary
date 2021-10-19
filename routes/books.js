const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const { render } = require('ejs');

router.get('/', async (req, res) => {
    const searchOptions = {};
    if(req.query.title !== undefined || req.query.title !== "undefined")
    searchOptions.title = new RegExp(req.query.title,'i');
    try {
        books = await Book.find(searchOptions);
        res.render('books/index',{books: books, searchOptions: req.query.title});
    } catch (error) {
        res.redirect('/');
    }
})
router.get('/new',async (req, res) => {
 renderNewPage(res,new Book(),false);
})
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        desc: req.body.desc
    });
    saveCover(book, req.body.cover);
    try {
        await book.save();
        res.redirect("/books");
    } catch (error) {
        renderNewPage(res,book,true);
    }
})

const renderNewPage = async (res,book,hasError) => {
    try{
            const authors = await Author.find({});
            const params = {book: book, authors: authors};
            if(hasError) params.error = "Error Creating Book";
            res.render('books/new', params );
        }catch(err){
            console.log(err);
            res.redirect('/books');
        }
}

const saveCover = (book, coverEncoded) => {
    const imageTypes = ['image/png', 'image/jpeg', 'images/gif'];
    if(coverEncoded === null || coverEncoded === '') return;
    const cover = JSON.parse(coverEncoded);
    if(cover !== null && imageTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router;