const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const { render } = require('ejs');
const book = require('../models/book');

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
    renderFormPage(res,new Book(),'new',false);
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
        renderFormPage(res,book,"new",true);
    }
})
router.get('/:id', (req,res) => {
    res.render('books/show',{book: req.book});
})
router.get('/:id/edit', (req,res) => {
    renderFormPage(res,req.book,"edit",false);
})
router.put('/:id/',async (req,res) => {
    try {
        req.book.title = req.body.title;
        req.book.author = req.body.author;
        req.book.publishDate = new Date(req.body.publishDate);
        req.book.pageCount = req.body.pageCount;
        req.book.desc = req.body.desc;
        if(req.body.cover !== null || req.body.cover !== '')
        saveCover(req.book, req.body.cover);
        await req.book.save();
        res.redirect(`/books/${req.book.id}`);
    } catch (error) {
        if(book !== null)
        renderFormPage(res,req.book,'edit',true)
        else
        res.redirect('/')
    }
})
router.delete('/:id/', async (req, res)=>{
    try{
        await req.book.remove();
        res.redirect('/books');
    }catch (error) {
        if(req.book !== null)
        res.render('books/show',{ book: req.book, error: 'Error deleting book.'})
        else res.render('/books');
    }
})

const renderFormPage = async (res,book,page,hasError) => {
    try{
            const authors = await Author.find({});
            const params = {book: book, authors: authors};
            if(hasError) params.error = (page === 'new')?"Error Creating Book":"Error Editing Book";
            res.render(`books/${page}`, params );
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

router.param('id',async (req, res,next, id) => {
    try {
        const book = await Book.findById(id).populate('author').exec();
        req.book = book;
    } catch (err) {
        console.log(err);
    }
    next();
})

module.exports = router;