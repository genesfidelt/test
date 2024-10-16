const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
    initializeDatabase(); // Call the function to initialize the database
});

// Function to initialize the database
const initializeDatabase = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS todos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            task VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        )
    `;
    connection.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Todos table initialized or already exists');
        }
    });
};

// Routes
app.get('/api/todos', (req, res) => {
    connection.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

app.post('/api/todos', (req, res) => {
    const { task } = req.body;
    connection.query('INSERT INTO todos (task) VALUES (?)', [task], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.status(201).json({ id: results.insertId, task });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.status(204).send();
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

