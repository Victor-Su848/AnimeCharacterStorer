//modules
const path = require("path");
const express = require("express");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const app = express();
const bodyParser = require("body-parser");

const { MongoClient, ServerApiVersion } = require("mongodb");

// Routes stuff
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

// Environment variables
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const mongoDatabase = process.env.MONGO_DB_NAME;
const mongoCollection = process.env.MONGO_COLLECTION;

// Mongo stuff

const uri = `mongodb+srv://${userName}:${password}@cluster0.d4ifwkg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Command line input
process.stdin.setEncoding("utf8");

// Default home page
app.get("/", (req, res) => {
  const toSend = {
    port: 3000,
  };

  res.render("index", toSend);
});

// Favorite cat image based off user
app.use(bodyParser.urlencoded({extended:false}));
app.post("/processFavoriteForm", async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const imgURL = req.body.imgURL;
    console.log(`User's email to store image: ${email}`);
    console.log(`Image URL to store: ${imgURL}`);

    try {
        await client.connect();
        let student1 = {email: email, imgURL: imgURL}
        await client.db(mongoDatabase).collection(mongoCollection).insertOne(student1);
        res.send("Image favorited successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to favorite image");
    }
})

// View a user's favorite cat
app.post("/viewFavoriteCat", async (req, res) => {
    const { email } = req.body;
    console.log(`Fetching favorite cat for email: ${email}`);

    try {
        await client.connect();
        const database = client.db(mongoDatabase);
        const collection = database.collection(mongoCollection);
        const favoriteCat = await collection.findOne({ email: email });

        if (favoriteCat) {
            res.render("favoriteCat", { catUrl: favoriteCat.imgURL, email: email });
        } else {
            res.send("No favorite cat found for this email.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error accessing the database.");
    } finally {
        await client.close();
    }
});


// Set the server to listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
