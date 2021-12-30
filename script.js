'use strict'
//book object constructor
function book (id, title, author, pages, read){
    this.id = id;
    this.Title = title;
    this.Author = author;
    this.Pages = pages;
    this.Read = read;
}

book.prototype.readStatusChange = function(){
    if (this.Read === false){
        this.Read = true;
        console.log('changed to true')
        return;
    }
        this.Read = false;
        console.log('changed to false');
        return;
}

//initiate the array to hold all books
let myLibrary = [];

function addBookToLibrary(book){
myLibrary.push(book);
}

let book1 = new book(0, "The Lord of the rings", "J.R.R. Tolkien", 1000, true);
let book2 = new book(1, "One Flew Over the Cuckoo's Nest", "Ken Kesey", 200,true);
let book3 = new book(2,"Test Book", "Test Author", 0, false);
addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);

//create an empty placeholder book to generate the table headers
const placeholderBook = new book();

const body = document.getElementsByTagName('body')[0];
const table = document.createElement('table'); //table element

function createTable(){
    const tblHeader = table.createTHead();//create header in the table
    const tblBody = table.createTBody();//create table body
    const hRow = tblHeader.insertRow(0);//create one row in the header
    for (const property in placeholderBook){//generate the header cells with own proprties only(inherited ones will be skipped)
        if (placeholderBook.hasOwnProperty(property)){
            if (property === 'id') {continue}//keep the id hidden
            let cell = hRow.insertCell();
            if (property === 'Read'){
                cell.innerText = 'Read?'
                continue;
            }
            cell.innerText = property;
        }
    }
    const cell = hRow.insertCell();
    cell.innerText = 'Delete?'//add a row for the delete button
}

createTable();

body.appendChild(table);//add the table to the body

const tblBody = document.getElementsByTagName('tbody')[0];

// add books to the table body, one at each line
function updateBookTable(){
    tblBody.innerHTML = "";//clears the table body otherwise it will just grow the table exponentially when you call the function
    myLibrary.forEach((book) =>{
        let newRow = tblBody.insertRow();
        newRow.dataset.value = book.id;
        for (const property in book){
            if (book.hasOwnProperty(property)){
                if (property === 'id'){continue}//do not display the ids
                let cell = newRow.insertCell();
                if (property === 'Read'){
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.className = "readCheckbox";
                    checkbox.dataset.value = book.id;
                    const checkedCheckbox = document.createElement("input");
                    checkedCheckbox.type = "checkbox";
                    checkedCheckbox.className = "readCheckbox";
                    checkedCheckbox.dataset.value = book.id;
                    checkedCheckbox.checked = true;
                    book[property] ? (cell.appendChild(checkedCheckbox)) : (cell.appendChild(checkbox));
                    continue; 
                }
                cell.innerText = book[property];
            }
        }
        let deleteBtn = document.createElement('button');
        deleteBtn.className = "material-icons";
        deleteBtn.textContent = "delete";
        deleteBtn.dataset.value = book.id;
        deleteBtn.onclick = function deleteBook(){
            myLibrary.splice(newRow.dataset.value, 1);
            updateIds(myLibrary);
            updateBookTable();
        }
        const cell = newRow.insertCell();
        cell.appendChild(deleteBtn)
        }
    )
    readCheckbox();//add evnet listeners to the checkboxes after recreating the table
};

updateBookTable();

function readCheckbox(){
    document.querySelectorAll('.readCheckbox').forEach(item => {
    item.addEventListener('click', event => {
        myLibrary[event.target.dataset.value].readStatusChange();//get the book by its id and change its 'read' attribute
    });
});
};

readCheckbox();

// Get the modal
const modal = document.getElementById("addBookForm");

// Get the button that opens the modal
const btn = document.getElementById("addBookBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

//Get the form
const form = document.getElementsByClassName("formContainer")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  form.reset();
}

//When the user clicks Close, close the modal
function closeForm(){
    modal.style.display = "none";
    form.reset();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    form.reset();
  }
}

function addBook(){
    const id = myLibrary.length;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    let read = false;
    if(document.getElementById('read').checked){
        read = true;
    };
    const newBook = new book(id, title, author, pages, read);
    addBookToLibrary(newBook);
    modal.style.display ="none";//close the modal
    form.reset();//reset the form
    updateBookTable();//recreate the table
}

//function to update the book IDs in the array when a book is deleted.
//In that way the ID will correspond to the index in the array and the 
//deletion and changing of read status could work properly
function updateIds(myLibrary){
    myLibrary.forEach((item, index) => {
        item.id = index;
    });
}