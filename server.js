const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL-database med Knex
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }  // Railway trenger dette
    }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // statiske filer (HTML, CSS, JS)
app.set('view engine', 'ejs'); // hvis du bruker EJS, kan endres

// GET: Hovedside
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// POST: Login eksempel
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username, password }).first();
        if (user) {
            res.send(`Velkommen tilbake, ${user.username}!`);
        } else {
            res.status(401).send('Feil brukernavn eller passord');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Noe gikk galt med databasen.');
    }
});

// Start serveren
app.listen(port, () => {
    console.log(`🚀 Server kjører på http://localhost:${port}`);
});
