## Readme

This is a RESTful API application with endpoints for managing drinks. The drinks are locally stored in a JSON file, and the app uses Redis as a caching system to improve performance by storing and retrieving data.

### Docker
The application requires Docker Compose. 
Install Docker Compose in the following way to easily compose and run the Redis container:

### Installation
1. Clone the repository or download the source code
2. Navigate to the project directory
3. Run "npm install" to install the required dependencies
4. Run the following command and start the app with the Redis container:

```
docker-compose up --build
```
This command will build the application and create a Redis container using Compose.
You can define the prefered port for the Redis container in the docker-compose.yml file.

4. Access the API at: `http://localhost:<host>`
### API Endpoints:
###### GET /drinks 
– gets the JSON array of all accessible drinks.
###### GET /drinks/:id 
– gets the data of drink having the provided id.
###### POST /drinks 
– adds new drink based on requests body.
###### DELETE /drinks/:id 
– deletes the drink of id.

Each drink has a:
name (string);
unique id (number);
list of ingredients (array of strings);
description (string).

##### Redis Caching

The Redis cache is used to store and retrieve drinks data, reducing the need to read from the file system on each request. The caching logic is implemented using the Redis client library.
The Redis client is defined in the redis.js file. 

![client-side-caching](/public/images/clientside.png)  

When a request is made to retrieve drinks, the application first checks if the data is available in the Redis cache. If found, it is returned directly. If not, the data is read from the JSON file, stored in the Redis cache for future use, and then returned to the client. This caching logic is defined in the router file routes/drinks.js.

