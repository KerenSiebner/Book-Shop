'use strict'


const STORAGE_KEY = 'booksDB'

const gBooksInfo = [
    { bookName: 'Goodnight Moon', price: 10, imgUrl: "img/good-night.jpeg" },
    { bookName: 'The Very Hungry Caterpillar', price: 15, imgUrl: "img/hungry-caterpillar.jpg" },
    { bookName: 'Harry Potter', price: 25, imgUrl: "img/harry-potter.jpg" },
    { bookName: 'The Giving Tree', price: 8, imgUrl: "img/giving-tree.jpg" }
]

var gBooks
var gFilterBy = { bookName: '', }

var gPageIdx = 0
const PAGE_SIZE = 3

var gIsSort

_createBooks()

function addBook(bookName, price, imgUrl) {
    const book = _createBook(bookName, price, imgUrl = 'img/book-icon.png')
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
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

function _createBook(bookName, price, imgUrl) {
    return {
        id: makeId(),
        bookName,
        price,
        imgUrl,
        rate: 0
    }
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

function setBookFilter(filterBy={}) {
    gPageIdx = 0
    if (filterBy.bookName !== undefined) gFilterBy.bookName = filterBy.bookName
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    console.log('gFilterBy', gFilterBy)
    return gFilterBy
}

function getBooks() {
    console.log('gBooks',gBooks)
    console.log('gFilterBy',gFilterBy)

    var books = gBooks.filter(book => 
        book.rate >= gFilterBy.minRate &&
        book.price <= gFilterBy.maxPrice &&
        book.bookName.toLowerCase().includes(gFilterBy.bookName)
        )
        console.log('books',books)
    // return books

    const startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE) 
}

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    return book
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = Math.ceil(gBooks.length / PAGE_SIZE) - 1
    }
}

function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE <= gBooks.length) {
        gPageIdx = 0
    }
}

function setBooksFilter(filterBy) {
    gFilterBy.bookName = filterBy
    return gFilterBy
}

function showRateValue(rateValue){
    const elRate = document.querySelector('.rate-value')
    elRate.innerHTML = rateValue
}
function showPriceValue(priceValue){
    const elPrice = document.querySelector('.price-value')
    elPrice.innerHTML = priceValue
}

function setSort(sortBy = {}) {
    if (sortBy.price) {
        gBooks.sort((c1, c2) => (c1.price - c2.price) * sortBy.price)
        gIsSort = !gIsSort
    } else if (sortBy.rate) {
        gBooks.sort((c1, c2) => (c1.rate - c2.rate) * sortBy.rate)
        gIsSort = !gIsSort
    } else if (sortBy.name) {
        gBooks.sort((c1, c2) => c1.bookName.localeCompare(c2.bookName) * sortBy.name)
        gIsSort = !gIsSort
    }
}

function isSorted(){
    return gIsSort
}

