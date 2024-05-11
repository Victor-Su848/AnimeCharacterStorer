//modules 
const path = require("path");
const express = require("express");
//require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 
const app = express();
const bodyParser = require("body-parser");

const { MongoClient, ServerApiVersion } = require('mongodb');

//Command line input
process.stdin.setEncoding("utf8");

// Define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  // Set the server to listen on port 3000
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${3000}`);
  });