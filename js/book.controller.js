'use strict'

function onInit() {
    // renderVendors()
    renderBooks()
    doTrans()
    renderFilterByQueryStringParams()
}


function onAddBook() {
    var bookName = prompt('book name?')
    var price = prompt('price?')
    var imgUrl = prompt('imgUrl?')
    if (bookName && price) {
        const book = addBook(bookName,price,imgUrl)
        renderBooks()
        saveToStorage(STORAGE_KEY, gBooks)
        // flashMsg(`Book Added (id: ${book.id})`)
    }
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    saveToStorage(STORAGE_KEY, gBooks)
    // flashMsg(`Book Deleted`)
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('New price?', book.price)
    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice)
        renderBooks()
        saveToStorage(STORAGE_KEY, gBooks)
        // flashMsg(`Price updated to: ${book.price}`)
    }
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.bookName
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('.img').innerHTML = `<img class="img-read"src="${book.imgUrl}" alt="">`
    elModal.querySelector('.rate').innerHTML = `            
    <h4>Rate: &nbsp;</h4>
    <button class="minus" onclick="onMinusClick('${bookId}')"> - </button>
    <span class="num-rate">${book.rate}</span>
    <button class="plus" onclick="onPlusClick('${bookId}')"> + </button>`
    elModal.classList.add('open')
}

function onMinusClick(bookId){
    const book= getBookById(bookId)
    if(book.rate === 0) return 
    book.rate--
    renderRateNum(book.rate)
}

function onPlusClick(bookId){
    const book= getBookById(bookId)
    if(book.rate === 10) return 
    book.rate++
    renderRateNum(book.rate)
}

function renderRateNum(bookRate){
    var elRate = document.querySelector('.num-rate')
    elRate.innerText = `${bookRate}`
}

function onCloseModal() {
    renderBooks()
    saveToStorage(STORAGE_KEY, gBooks)
    document.querySelector('.modal').classList.remove('open')
}

function renderBooks() {
    var books = getBooks()
    console.log('books', books)
    var strHtmls = books.map(book => `
    <tr>
    <td>${book.id}</td>
    <td>${book.bookName}</td>
    <td>${book.price}</td>
    <td>${book.rate}</td>
    <td><img class="book-img"src="${book.imgUrl}" alt=""></td>
    <td  value="${book.id}"><button class="read-btn" data-trans="read" onclick="onReadBook('${book.id}')">Read</button ></td>
    <td  value="${book.id}"><button class="update-btn" data-trans="update" onclick="onUpdateBook('${book.id}')">Update</button></td>
    <td  value="${book.id}"><button class="delete-btn" data-trans="delete" onclick="onDeleteBook('${book.id}')">Delete</button></td>
    </tr> `
    )
    strHtmls.unshift([`<table class="books-table"><tbody><tr> <th data-trans="id">Id</th><th data-trans="title-book">Title</th><th data-trans="price">Price</th><th data-trans="rate">Rate</th>  <th data-trans="img">Image</th> <th colspan="3" data-trans="actions">Actions</th></tr>`])
    strHtmls.push([`</tbody> </table>`])
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
}


function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    console.log('filterBy', filterBy)
    renderBooks()
    
    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice : +queryStringParams.get('maxPrice') || 50,
        minRate : +queryStringParams.get('minRate') || 0
    }

    if (!filterBy.maxPrice && !filterBy.minRate) return

    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    setBookFilter(filterBy)
}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPrevPage() {
    prevPage()
    renderBooks()
}


