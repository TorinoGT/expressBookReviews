const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() =>{
      if(books) {
        resolve(books);
      } else {
        reject('Failed to fetch books');
      }
    },3000)});
}

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
    setTimeout(() =>{
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject('Book not found');
      }
    },3000)});
}

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
    setTimeout(() =>{
      const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject('No books found by this author');
      }
    },3000)});
  }

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
    setTimeout(() =>{
      const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject('No books found with this title');
      }
    },3000)});
  }
  

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  //const existingUser = users.find(user => user.username === username);
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});


public_users.get('/', async function (req, res) {
    try {
      const booksData = await getBooks();
      res.send(JSON.stringify(booksData, null, 4));
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Failed to fetch books' });
    }
});



 public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const bookData = await getBookByISBN(isbn);
      res.send(bookData);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(404).json({ message: error });
    }
  });

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const booksByAuthor = await getBooksByAuthor(author);
      res.json(booksByAuthor);
    } catch (error) {
      console.error('Error fetching books by author:', error);
      res.status(404).json({ message: error });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const booksByTitle = await getBooksByTitle(title);
      res.json(booksByTitle);
    } catch (error) {
      console.error('Error fetching books by title:', error);
      res.status(404).json({ message: error });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    res.json(books[isbn].reviews);
});

module.exports.general = public_users;
