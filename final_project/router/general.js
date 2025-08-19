const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.status(500).json({ message: "Book not found" });
    }

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    try {
        const author = req.params.author;
        const match = [];

        const bookKeys = Object.keys(books);

        for (const key of bookKeys) {
            const book = books[key];
            if (book.author === author) {
                match.push(book);
            }
        }

        if (match.length > 0) {
            res.json(match);
        } else {
            res.status(404).json({ message: "No books found by that author" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving books" });
    }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    try {
        const title = req.params.title;
        const match = [];

        for (const book in books) {
            if (books[book].title === title) {
                match.push(books[book]);
            }
        }

        if (match.length > 0) {
            res.send(match);
        } else {
            res.status(404).json({ message: "No books with such title" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving books" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
