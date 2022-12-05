'use strict'


const STORAGE_KEY = 'booksDB'

const gBooksInfo = [
    { bookName: 'Goodnight Moon', price: 10, imgUrl: "img/good-night.jpeg" },
    { bookName: 'The Very Hungry Caterpillar', price: 15, imgUrl: "img/hungry-caterpillar.jpg" },
    { bookName: 'Harry Potter', price: 25, imgUrl: "img/harry-potter.jpg" },
    { bookName: 'The Giving Tree', price: 8, imgUrl: "img/giving-tree.jpg" }
]

var gBooks
var gFilterBy = { maxPrice: 50, minRate: 0 }

var gPageIdx = 0
const PAGE_SIZE = 4

_createBooks()



function addBook(bookName, price, imgUrl) {
    const book = _createBook(bookName, price, imgUrl = 'img/book-icon.png')
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}


function _createBook(bookName, price, imgUrl) {
    return {
        id: makeId(),
        bookName,
        price,
        imgUrl,
        rate: 0
    }
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < gBooksInfo.length; i++) { //make this with map
            books.push(_createBook(gBooksInfo[i].bookName, gBooksInfo[i].price, gBooksInfo[i].imgUrl))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}


function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    return book
}

function setBookFilter(filterBy = {}) {
    gPageIdx = 0
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    console.log('gFilterBy', gFilterBy)
    return gFilterBy
}

function getBooks() {
    var books = gBooks.filter(book => book.rate >= gFilterBy.minRate &&
        book.price <= gFilterBy.maxPrice)
    // return books

    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE) 
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
}

function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE <= gBooks.length) {
        gPageIdx = 0
    }
}

function Search(book){
    gBooks
    for (i = 0;i < gBooks.length; i++){
        if ((gBooks[i].bookName.toLowerCase()).indexOf(book) > -1) {
            gBooks[i].style.color = "yellow";
            } else {
                gBooks[i].style.color = "black";
                }
    }
}

