const express = require('express');
const fs = require('fs');

const drinksDataPath = './data/drinks.json';
const drinksRouter = express.Router();

// GET all drinks
drinksRouter.get('/', (req, res) => {
fs.readFile(drinksDataPath, 'utf8', (err, data) => {
if (err) {
    console.error(err);
    res.sendStatus(500);
    return;
}

res.json(JSON.parse(data));
});
});

// GET drink by ID
drinksRouter.get('/:id', (req, res) => {
const drinkId = Number(req.params.id);

fs.readFile(drinksDataPath, 'utf8', (err, data) => {
if (err) {
    console.error(err);
    res.sendStatus(500);
    return;
}

const drinks = JSON.parse(data);
const drink = drinks.find((d) => d.id === drinkId);

if (!drink) {
    res.sendStatus(404);
    return;
}

res.json(drink);
});
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
