var client = require('../redis.js');
const express = require('express');
const fs = require('fs');

const drinksDataPath = './data/drinks.json';
const drinksRouter = express.Router();

async function cache(req, res, next) {
const data = await client.get(req.originalUrl);
if (data !== null) {
    res.render('tutorials', {tutorials: JSON.parse(data)});
} else {
    next();
}
}

async function getDrinksFromRedis(req) {
const drinks = await client.get(req.originalUrl);
if (drinks !== null) {
    return JSON.parse(drinks);
} else {
    return null;
}
}

async function setDrinksInRedis(req, drinks) {
await client.set(req.originalUrl, JSON.stringify(drinks));
}


// GET all drinks
drinksRouter.get('/', async (req, res) => {
let drinks = await getDrinksFromRedis(req);
if (drinks === null) {
    fs.readFile(drinksDataPath, 'utf8', async (err, data) => {
    if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }

    drinks = JSON.parse(data);
    await setDrinksInRedis(req, drinks);

    res.json(drinks);
    });
} else {
    res.json(drinks);
}
});


// GET drink by ID
drinksRouter.get('/:id', cache, async function(req, res) {
const drinkId = Number(req.params.id);
let drinks = await getDrinksFromRedis(req);
if (drinks === null) {
    fs.readFile(drinksDataPath, 'utf8', async (err, data) => {
    if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }

    drinks = JSON.parse(data);
    await setDrinksInRedis(req, drinks);

    const drink = drinks.find((d) => d.id === drinkId);
    if (!drink) {
        res.sendStatus(404);
        return;
    }

    res.json(drink);
    });
} else {
    const drink = drinks.find((d) => d.id === drinkId);
    if (!drink) {
    res.sendStatus(404);
    return;
    }

    res.json(drink);
}
});


// POST a new drink
drinksRouter.post('/', (req, res) => {
const newDrink = req.body;

fs.readFile(drinksDataPath, 'utf8', (err, data) => {
if (err) {
    console.error(err);
    res.sendStatus(500);
    return;
}

const drinks = JSON.parse(data);
const lastDrink = drinks[drinks.length - 1];
const newId = lastDrink ? lastDrink.id + 1 : 1;

newDrink.id = newId;
drinks.push(newDrink);

fs.writeFile(drinksDataPath, JSON.stringify(drinks), (err) => {
    if (err) {
    console.error(err);
    res.sendStatus(500);
    return;
    }

    res.sendStatus(201);
});
});
});

// DELETE a drink by ID
drinksRouter.delete('/:id', (req, res) => {
const drinkId = Number(req.params.id);

fs.readFile(drinksDataPath, 'utf8', (err, data) => {
if (err) {
    console.error(err);
    res.sendStatus(500);
    return;
}

const drinks = JSON.parse(data);
const filteredDrinks = drinks.filter((d) => d.id !== drinkId);

if (drinks.length === filteredDrinks.length) {
    res.sendStatus(404);
    return;
}

fs.writeFile(drinksDataPath, JSON.stringify(filteredDrinks), (err) => {
    if (err) {
    console.error(err);
    res.sendStatus(500);
    return;
    }

    res.sendStatus(200);
});
});
});

module.exports = drinksRouter;
