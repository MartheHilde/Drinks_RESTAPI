#### In this task, I have created a simple Express application to deliver a small external API.
- Data is stored in a JSON file in data/drinks.json.

#### API has the following endpoints:
```
GET /drinks – gets the JSON array of all accessible drinks.
GET /drinks/:id – gets the data of drink having the provided id.
POST /drinks – adds new drink based on requests body.
DELETE /drinks/:id – deletes the drink of id.
Each drink has a:
name (string);
unique id (number);
list of ingredients (array of strings);
description (string).
```