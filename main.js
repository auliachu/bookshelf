document.addEventListener('DOMContentLoaded',function(){
    const form = document.getElementById('inputBook');
    console.log(form);

    form.addEventListener('submit',function(event){
        addNewBook();
        event.preventDefault();
    })
    if(isStorageExist()){
        loadDataFromStorage();
    }

    //searchBook
    const formSearchBook = document.getElementById('searchBook')
    console.log(formSearchBook);
    formSearchBook.addEventListener('submit',function(e){
        getBookFromSearchButton();
        e.preventDefault();
    })
})

const books = []; //array yang menampung banyaknya object buku
const RENDER_EVENT = 'render-books' //custom event yang berguna untuk --> perpindahan book (dari incomplete menjadi complete, dan sebaliknya), menambah book, maupun menghapus. 
//membuat fungsi menambahkan buku

function generateId(){
    return +new Date();
}


function addNewBook(){
    const titleBook = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isBookCompleted = document.getElementById('inputBookIsComplete').checked;
    console.log(isBookCompleted);
    
    //console.log(titleBook,author,year);
    const generateID = generateId() // ini fungsi untuk membuat ID
    const bookObject = generateBookObject(generateID,titleBook,author,year, isBookCompleted) //ini fungsi untuk membuat object berisikan data buku
    books.push(bookObject); //masukkan masing-masing object ke dalam array
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateBookObject(idBook,titleBook,author,year,isBookCompleted){
    return{
        idBook,
        titleBook,
        author,
        year,
        isBookCompleted
    }
}
// console.log(generateBookObject());

document.addEventListener(RENDER_EVENT,function(){
    console.log(books);
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML='';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML='';
    
    for(const bookItem of books){
        const bookElement = makeBook(bookItem); //fungsi membuat buku
        console.log(`ini adalah bookitem--> ${bookItem.isBookCompleted}`);
        console.log(bookElement);
        if(!bookItem.isBookCompleted){
            uncompletedBookList.append(bookElement);
        }else{        
            completedBookList.append(bookElement);
        }
    }

    //nambahkan kondisi searchbar
})

function makeBook(bookObject){
    const textTitle = document.createElement('h3');
    textTitle.innerText=bookObject.titleBook;

    const textAuthor = document.createElement('p');
    textAuthor.innerText=`Penulis: ${bookObject.author}`;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle,textAuthor);
    container.setAttribute('id', `book-${bookObject.idBook}`);
    console.log(container);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    if(bookObject.isBookCompleted){
        const stillRead = document.createElement('button');
        stillRead.classList.add('green');
        stillRead.innerHTML='Belum Selesai di Baca';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerHTML='Hapus Buku';

        stillRead.addEventListener('click',function(){
            undoBookFromCompleted(bookObject.idBook)
        })

        deleteButton.addEventListener('click', function(){
            removeBookFromCompleted(bookObject.idBook) //buat fungsi
        })
        buttonContainer.append(stillRead,deleteButton);
    } else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerHTML='Selesai di Baca';

        const deleteButton2 = document.createElement('button');
        deleteButton2.classList.add('red');
        deleteButton2.innerHTML='Hapus buku';

        deleteButton2.addEventListener('click', function(){
            removeBookFromCompleted(bookObject.idBook);
        })

        checkButton.addEventListener('click', function(){
            addBookToCompleted(bookObject.idBook);
        })
        buttonContainer.append(checkButton,deleteButton2);
    }

    container.append(buttonContainer);
    return container;
}

function findIndexBook(todoId){
    for(const index in books){
        if(books[index].idBook===todoId){
            console.log(index); //mengeluarkan index/urutan buku
            return index;
        }
    }
    return -2;
}

function findBook(todoId){
    for(const bookItem of books){
        if(bookItem.idBook==todoId){
            return bookItem;
        }
    } //findTodo, yang mana berfungsi untuk mencari todo dengan ID yang sesuai pada array todos.
    return null;
}

function addBookToCompleted(todoId){
    const bookTarget = findBook(todoId);

    if(bookTarget===null){
        return
    }
    bookTarget.isBookCompleted=true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(todoId){
    const bookTarget = findIndexBook(todoId);
    if(bookTarget===-2) return
    books.splice(bookTarget,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    console.log('Buku sudah dihapus');
    saveData();
}

function undoBookFromCompleted(todoId){
    const bookTarget = findBook(todoId)

    if(bookTarget===null)return 
    bookTarget.isBookCompleted=false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    console.log('Buku sudah di pindahkan ke belum selesai dibaca');
    saveData();
}

//ini membuat penyimpanan

const STORAGE_KEY = 'BOOKSHELF_APPS';
const SAVED_EVENT = 'save-book';

function isStorageExist(){
    if(typeof(Storage)=== undefined){
        alert('Your browser is incompatible');
        return false;
    }
    return true;
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    console.log('ini adalah json parse -> '+data);
    if(data !== null){
        for(const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books); //konversi data object ke string agar bs disimpan di local
        console.log('ini adalah object yang diubah ke string -> '+parsed);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY))
})

//Search bar
function getBookFromSearchButton(e){
    const keyword = document.getElementById('searchBookTitle').value;
    console.log('ini adalah buku yang dicari--> '+keyword);
    updateResults(keyword);
    //getFromLocalStorage();
}

function getFromLocalStorage(){
    const bookStorage = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    console.log('ini adalah array buku yang tersimpan di local storage--> ');
    console.log(bookStorage); //bookStorage.idBook
    return bookStorage;
}

function updateResults(keyword){
    const bookTitle = getFromLocalStorage();
    if (keyword.trim()==='') return; //mengabaikan space berlebih di searchbar

    const filteredBooks = bookTitle.filter(item => {
        const titleMatch = item.titleBook.toLowerCase().includes(keyword);
        console.log('ini isi dari filtered match--> ')
        console.log(titleMatch);
        return titleMatch;
    });

    console.log('ini adalah isi dari filtered books-> ')
    console.log(filteredBooks);
    return filteredBooks;
}