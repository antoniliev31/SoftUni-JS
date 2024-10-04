const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const PORT = 3000;
const path = require("path")
const app = express();

const { getKittens, addKitten } = require('./kittens')

// View Engine
app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

/** MIDDLEWARE START*/
// Third-party Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Global Midleware
app.use((req, res, next) => {
    // 
    console.log(`HTTP Request: ${req.method}, Request path: ${req.path}`);
    next();
});

// Partial routing middleware
app.use('/kittens', (req, res, next) => {
    // 
    console.log("Kittens Middleware has been invoked!");
    next();
});

// Concrete routing midleware
const specificMidleware = (req, res, next) => {
    console.log("This is specific routes MIDLEWARE");
    next(); // next Important!!!
};

/** MIDDLEWARE END*/


/** ROUTING START */
app.get('/', (req, res) => {
    res.render("home");
    //res.send("Hello, this is home page");
});

app.get('/about', (req, res) => {
    res.render("about");
});

// Endpoint -> method, path, ACTON 
app.get('/kittens', (req, res) => {
    const kittens = getKittens();
    console.log({ kittens });
    res.render('kittens', {kittens} )
});

app.post('/kittens', (req, res) => {    
    console.log(req.body);
    const name = req.body.name;
    const age = Number(req.body.age);
    addKitten(name, age);
    res.send("Kitten has been created");
});

app.get('/kittens/:kittenId', (req, res) => {
    const kittenId = Number(req.params.kittenId);

    if (!kittenId) {
        res.status(404).send("Bad kitten id: " + req.params.kittenId);
        return;
    }

    res.send({ id: kittenId, name: "Kir4o" + kittenId });
});

app.get('/download-png', (req, res) => {
    res.download("./kitten.png");
});

app.get('/attachment-png', (req, res) => {
    res.attachment("./postman.png");
    res.end();
});

app.get('/specific', specificMidleware, (req, res) => {
    res.send("This is specific route! ;)");
});

// Това ще мачне всичко което напише потребителя. Слага се последно!!! 
app.get('*', (req, res) => {
    res.status(404);
    res.send("Page not found!");
});

/** ROUTING END */

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));