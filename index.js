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
        const OrderCollection = client.db("manufacture-plant").collection("orders");
        const userCollection = client.db("manufacture-plant").collection("users");

        // get all product
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = ProductCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // post database
        app.post('/products', async (req, res) => {
            const newService = req.body
            const result = await ProductCollection.insertOne(newService)
            res.send(result)
        })
        // delete item
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ProductCollection.deleteOne(query)
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
        // post  review
        app.post('/reviews', async (req, res) => {
            const newService = req.body
            const result = await ReviewCollection.insertOne(newService)
            res.send(result)
        })

        // update item
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    MOQ: updateUser.MOQ,
                    MOQDecrese: updateUser.MOQDecrese
                }
            }
            const result = await ProductCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        // order collection api
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await OrderCollection.insertOne(order)
            res.send(result)
        })
        // get order item
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = { email: email };
            const bookings = await OrderCollection.find(query).toArray();
            res.send(bookings)
        })
        // delete order item
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: ObjectId(id) }
            console.log(query)
            const result = await OrderCollection.deleteOne(query)
            res.send(result)
        })

        // delete products
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ProductCollection.deleteOne(query)
            res.send(result)
        })

        // insert user (login/register) information
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email };
            const option = { upsert: true };
            const updateDoc = {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, updateDoc, option)
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET)
            res.send({ result, token })
        })
        // Make Admin
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' },
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result)
        })
        // get all users
        app.get('/user', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });

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


