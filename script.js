'use strict'
//book object constructor
class book {
    constructor (id, title, author, pages, read){
        this.id = id;
        this.Title = title;
        this.Author = author;
        this.Pages = pages;
        this.Read = read;
    }

    readStatusChange = () => {
        this.Read ? this.Read = false : this.Read = true; 
    }

}

class library {

    books = [];

    addBook(book) {
        this.books.push(book);
    }

    //function to update the book IDs in the array when a book is deleted.
    //In that way the ID will correspond to the index in the array and the 
    //deletion and changing of read status could work properly
    updateIds(){
        this.books.forEach((book, index) => {
            book.id = index;
        });
    }

}

//initiate the array and add some books
let myLibrary = new library;

myLibrary.addBook(new book(0, "The Lord of the rings", "J.R.R. Tolkien", 1000, true));
myLibrary.addBook(new book(1, "One Flew Over the Cuckoo's Nest", "Ken Kesey", 200,true));
myLibrary.addBook(new book(2,"Test Book", "Test Author", 0, false));

const displayController = (() => {
    //create an empty placeholder book to generate the table headers
    const tableHeaderTitles = new book();
    const body = document.getElementsByTagName('body')[0];
    const table = document.createElement('table'); //table element
    body.appendChild(table);//add the table to the body

    const createTable = () => {
        const tblHeader = table.createTHead();//create header in the table
        table.createTBody();//create table body
        const hRow = tblHeader.insertRow(0);//create one row in the header
        for (const property in tableHeaderTitles){
                if (property === 'id' || property === 'readStatusChange') {continue}//keep the class' 'id' property and the method hidden 
                let cell = hRow.insertCell();
                if (property === 'Read'){
                    cell.innerText = 'Read?'//for better user understanding puproses
                    continue;
                }
                cell.innerText = property;
        }
        const cell = hRow.insertCell();
        cell.innerText = 'Delete?'//add a row for the delete button
        updateBooks();//add the books
    }

    // add books to the table body, one at each line
    const updateBooks = () => {
        const tblBody = document.getElementsByTagName('tbody')[0];
        tblBody.innerHTML = "";//clears the table body otherwise it will just grow the table exponentially when you call the function
        myLibrary.books.forEach((book) =>{
            let newRow = tblBody.insertRow();
            newRow.dataset.value = book.id;
            for (const property in book){
                if (property === 'id' || property === 'readStatusChange'){continue}//do not display the ids and the method
                let cell = newRow.insertCell();
                if (property === 'Read'){
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.className = "readCheckbox";
                    checkbox.dataset.value = book.id;
                    book[property] ? checkbox.checked = true : checkbox.checked = false;
                    checkbox.addEventListener('click', event => {myLibrary.books[event.target.dataset.value].readStatusChange()});//get the book by its id and change its 'Read' attribute
                    cell.appendChild(checkbox);
                    continue;
                }
                cell.innerText = book[property];
            }
            let deleteBtn = document.createElement('button');
            deleteBtn.className = "material-icons";
            deleteBtn.textContent = "delete";
            deleteBtn.dataset.value = book.id;
            deleteBtn.onclick = function deleteBook(){
                myLibrary.books.splice(newRow.dataset.value, 1);
                myLibrary.updateIds();
                updateBooks();
            }
            const cell = newRow.insertCell();
            cell.appendChild(deleteBtn);
            }
        )
    };

// Get the modal
const modal = document.getElementById("addBookForm");

// the button that opens the modal
document.getElementById("addBookBtn").onclick = () => {modal.style.display = "block"};

// Cancel closes the modal and resets the form
document.getElementsByClassName("btncancel")[0].onclick = () =>{closeModal()};

// Clicking the <span> element closes the modal and resets the form
document.getElementsByClassName("close")[0].onclick = () =>{closeModal()};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {closeModal()}
}

const closeModal = () => {
    modal.style.display = "none";
    document.getElementsByClassName("formContainer")[0].reset(); //resets the form when closing
}

//add button in the modal function
document.getElementsByClassName("btn")[0].onclick = () =>{
    const id = myLibrary.books.length;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    let read = false;
    if(document.getElementById('read').checked){
        read = true;
    };
    myLibrary.addBook(new book(id, title, author, pages, read));
    closeModal()
    updateBooks();//recreate the table
}

return {createTable, updateBooks};

})();

displayController.createTable();