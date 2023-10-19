document.addEventListener('DOMContentLoaded',function(){
    const form = document.getElementById('inputBook');
    console.log(form);

    form.addEventListener('submit',function(event){
        addNewBook();
        event.preventDefault();
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
    //saveData();/
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
        if(bookElement.isBookCompleted===false){
            uncompletedBookList.append(bookElement);
        }else{
            completedBookList.append(bookElement);
        }
    }
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

        deleteButton.addEventListener('click', function(){
            //removeTaskFromCompleted(bookObject.idBook) //buat fungsi
        })
        buttonContainer.append(stillRead,deleteButton);
    } else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerHTML='Selesai di Baca';

        const deleteButton2 = document.createElement('button');
        deleteButton2.classList.add('red');
        deleteButton2.innerHTML='Hapus buku';

        checkButton.addEventListener('click', function(){
            //addBookToCompleted(bookObject.idBook);
        })
        buttonContainer.append(checkButton,deleteButton2);
    }

    container.append(buttonContainer);
    return container;
}

