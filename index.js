const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
// const { restart } = require('nodemon');
const port = process.env.PORT || 5000

// middlewhare
app.use(cors())
app.use(express.json())


// const collection = client.db("test").collection("devices");


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5zmrg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const ProductCollection = client.db("manufacture-plant").collection("products");
        const ReviewCollection = client.db("manufacture-plant").collection("reviews");

        // get all product
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = ProductCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // get single service(purchage)
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ProductCollection.findOne(query)
            res.send(result)
          })
        // get all reviews
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = ReviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })





    } finally {
        // await client.close();
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Hello From Manufacture plant!')
})

app.listen(port, () => {
    console.log(`Manufacture plant app listening on port ${port}`)
})


