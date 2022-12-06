var gCurrLang = 'en'

var gTrans = {
    title: {
        en: 'Welcome to my bookshop',
        he: 'ברוכים הבאים לספריה שלי'
    },
    id: {
        en: 'ID',
        he: 'מס זיהוי'
    },
    'title-book': {
        en: 'Title',
        he: 'שם הספר'
    },
    price: {
        en: 'Price',
        he: 'מחיר'
    },
    rate: {
        en: 'Rate',
        he: 'דירוג'
    },
    img: {
        en:'Image',
        he: 'תמונה',
    },
    actions: {
        en: 'Actions',
        he: 'פעולות'
    },

    'next-page': {
        en: 'Next Page',
        he: 'עמוד הבא',
    },
    'prev-page': {
        en: 'Previus Page',
        he: 'עמוד קודם',
    },
    add: {
        en: 'Create new book',
        he: 'הוסף ספר',
    },
    read: {
        en: 'Read',
        he: 'קרא ספר',
    },
    update: {
        en: 'Update',
        he: 'עדכן מחיר',
    },
    delete: {
        en: 'Delete',
        he: 'מחק ספר',
    },
    'max-price': {
        en: 'Maximum Price:',
        he: 'מחיר מקסימלי'
    },

    'min-rate': {
        en: 'Minimum Rate:',
        he: 'דירוג מינימלי',
    },
    // sure: {
    //     en: 'Are you sure?',
    //     he: 'בטוח נשמה?',
    // },
    // 'add-todo-placeholder': {
    //     en: 'What needs to be done?',
    //     he: 'מה יש לעשות?'
    // }
}
function setLanguage(langSelector) {
    const selectedLang = langSelector.dataset.lang
    console.log('selectedLang', selectedLang)
    gCurrLang = selectedLang
    addLangURLParam()
    
    if (gCurrLang === 'he') {  
        document.querySelector('.container').classList.add('rtl')
        // document.querySelector('.form-check-input').classList.add('rtl')
    }
    else {
        document.querySelector('.container').classList.remove('rtl')
        // document.querySelector('.form-check-input').classList.remove('rtl')
    }
    doTrans()
}

function addLangURLParam(){
    const searchParams = new URLSearchParams(window.location.search)
    console.log('searchParams', searchParams)
    searchParams.set('language',gCurrLang)
    const newRelativePathQuery = window.location.pathname+"?"+searchParams.toString()
    history.pushState(null,"",newRelativePathQuery)
    // const queryStringParams = `?language=${gCurrLang}`
    // const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    // window.history.pushState({ path: newUrl }, '', newUrl)
    
}
    



// function renderFilterByQueryStringParams() {
//     const queryStringParams = new URLSearchParams(window.location.search)
//     const filterBy = {
//         bookName : +queryStringParams.get('bookName') || '',
//         maxPrice : +queryStringParams.get('maxPrice') || 50,
//         minRate : +queryStringParams.get('minRate') || 0
//     }

//     if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.bookName) return

//     document.querySelector('.filter-price-range').value = filterBy.maxPrice
//     document.querySelector('.filter-rate-range').value = filterBy.minRate
//     setBookFilter(filterBy)
//     // const queryStringParams = new URLSearchParams(window.location.search)
//     // const filterBy = { bookName: queryStringParams.get('bookName') || '' }
//     // if (!filterBy.bookName) return

//     // setBooksFilter(filterBy)
// }



function getTrans(transKey) {
    // done: if key is unknown return 'UNKNOWN'
    const key = gTrans[transKey]
    if (!key) return 'UNKNOWN'

    // done: get from gTrans
    var translation = key[gCurrLang]

    // done: If translation not found - use english
    if (!translation) translation = key.en

    return translation
}

function doTrans() {
    // done: 
    // var els = document.querySelectorAll('[data-trans]'
    // for each el:
    //    get the data-trans and use getTrans to replace the innerText 
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const translation = getTrans(transKey)

        el.innerText = translation

        // done: support placeholder    
        if (el.placeholder) el.placeholder = translation
    })
}

function setLang(lang) {
    gCurrLang = lang
}




function formatNumSimple(num) {
    return num.toLocaleString('es')
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatCurrency(num) {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(num)
}

function formatDate(time) {
    var options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: true,
    }

    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

// Kilometers to Miles
function kmToMiles(km) {
    return km / 1.609
}

// Kilograms to Pounds:
function kgToLbs(kg) {
    return kg * 2.20462262185
}


function getPastRelativeFrom(ts) {
    const diff = Date.now() - new Date(ts)
    const seconds = diff / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    const formatter = new Intl.RelativeTimeFormat('en-US', {
        numeric: 'auto'
    })
    if (seconds <= 60) return formatter.format(-seconds, 'seconds')
    if (minutes <= 60) return formatter.format(-minutes, 'minutes')
    if (hours <= 24) return formatter.format(-hours, 'hours')
    return formatter.format(-days, 'days')
}
