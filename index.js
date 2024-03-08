const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json())



const uri = `mongodb+srv://${process.env.VITE_MONGODB_USER}:${process.env.VITE_MONGODB_PASS}@cluster0.8wqrrau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        const addBookCollection = client.db('LibraryMS').collection('addbooks')
        const borrowedBooksCollection = client.db('LibraryMS').collection('borrowed')

        // post(add BOOKS) books
        app.post('/addbooks', async (req, res) => {
            const addbook = req.body;
            const result = await addBookCollection.insertOne(addbook)
            res.send(result)
        })

        // Get addall books
        app.get('/addbooks', async (req, res) => {
            const result = await addBookCollection.find().toArray()
            res.send(result)
        })
        // Get addbooks by perams
        app.get('/addbooks/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await addBookCollection.find(query).toArray()
            res.send(result)
        })

        // Get single addbooks
        app.get('/addbooks/:id', async (req, res) => {
            const id = req.params.id;
            const result = await addBookCollection.findOne({ _id: new ObjectId(id) })
            res.send(result)
        })

        app.put('/addbooks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const Option = { upsert: true }
            const updateProduct = req.body
            const Product = {
                $set: {
                    bookImage: updateProduct.bookImage,
                    bookName: updateProduct.bookName,
                    authorName: updateProduct.authorName,
                    category: updateProduct.category,
                    Rating: updateProduct.Rating,
                }
            }
            const result = await addBookCollection.updateOne(filter, Product, Option)
            res.send(result)

        })

        // post borrowed books
        app.post('/borrowed', async (req, res) => {
            const borrowedbook = req.body;
            const result = await borrowedBooksCollection.insertOne(borrowedbook)
            res.send(result)
        })
        // get all borrowed book
        app.get('/borrowed', async (req, res) => {
            const result = await borrowedBooksCollection.find().toArray()
            res.send(result)
        })
        // get borrowed params
        app.get('/borrowed/:email', async (req, res) => {
            const email = req.params.email;
            const fiter = { email: email }
            const result = await borrowedBooksCollection.find(fiter).toArray()
            res.send(result)
        })

        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})