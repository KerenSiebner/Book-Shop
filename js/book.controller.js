'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    doTrans()
}

function renderBooks() {
    var books = getBooks()
    // console.log('books', books)
    var strHtmls = books.map(book => `
    <tr>
    <td>${book.id}</td>
    <td>${book.bookName}</td>
    <td>${book.price}</td>
    <td>${book.rate}</td>
    <td><img class="book-img"src="${book.imgUrl}" alt=""></td>
    <td  value="${book.id}"><button class="read-btn btn btn-light" data-trans="read" onclick="onReadBook('${book.id}')">${getTrans("read")}</button ></td>
    <td  value="${book.id}"><button class="update-btn btn btn-light" data-trans="update" onclick="onUpdateBook('${book.id}')">${getTrans("update")}</button></td>
    <td  value="${book.id}"><button class="delete-btn btn btn-light" data-trans="delete" onclick="onDeleteBook('${book.id}')">${getTrans("delete")}</button></td>
    </tr> `
    )
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
}

function onAddBook() {
    var bookName = prompt('book name?')
    var price = +prompt('price?')
    var imgUrl = prompt('imgUrl?')
    if (bookName && price) {
        const book = addBook(bookName,price,imgUrl)
        renderBooks()
        saveToStorage(STORAGE_KEY, gBooks)
    }
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    saveToStorage(STORAGE_KEY, gBooks)
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('New price?', book.price)
    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice)
        renderBooks()
        saveToStorage(STORAGE_KEY, gBooks)
    }
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.bookName
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('.img').innerHTML = `<img class="img-read" src="${book.imgUrl}" alt="">`
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


function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    // console.log('filterBy', filterBy)
    renderBooks()
    
    const queryStringParams = `?bookName=${filterBy.bookName}?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        bookName : +queryStringParams.get('bookName') || '',
        maxPrice : +queryStringParams.get('maxPrice') || 50,
        minRate : +queryStringParams.get('minRate') || 0
    }

    if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.bookName) return

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


function onKeyUpSearch() {
    setTimeout(() => {
        const searchStr = document.querySelector('.search-Input').value
        const filterBy = setBooksFilter(searchStr)
        renderBooks()
        document.querySelector('.search-Input').value = searchStr

        const queryStringParams = `?bookName=${filterBy.bookName}`
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
        window.history.pushState({ path: newUrl }, '', newUrl)
    }, 1500);
}

function onSetSortBy(sortBy){
    var prop = sortBy
    var sortBy = {}
    sortBy[prop] = (isSorted()) ? -1 : 1

    setSort(sortBy)
    renderBooks()
}