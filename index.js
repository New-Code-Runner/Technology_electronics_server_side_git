const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyhjpez.mongodb.net/?appName=Cluster0`;
console.log(uri);

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
   
    // await client.connect();
   
    // database
    const addingProduct = client.db('productDB').collection('product');
    const cartCollection = client.db("productDB").collection("cartCollection");


    //  addProduct send
    app.post('/addProduct', async(req, res)=>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await addingProduct.insertOne(newProduct);
      res.send(result);
  });


  //  my cart send
  app.post("/myCart", async (req, res) => {
    const product = req.body;
    console.log("new product", product);
    const cartResult = await cartCollection.insertOne(product);
    res.send(cartResult);
  });

  // myCart get
  app.get("/myCart", async (req, res) => {
    const cursor = cartCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });

  // myCart delete
  app.delete("/myCart/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartCollection.deleteOne(query);
    res.send(result);
  });


     //  addProduct get
    app.get('/addProduct', async(req,res)=>{
      const cursor = addingProduct.find();
      const result = await cursor.toArray();
      res.send(result);

    });

      // update product by id
      app.get("/updateProduct/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await addingProduct.findOne(query);
        res.send(result);
      });
    
//  addProduct get brand
app.get("/addProduct/:brand", async (req, res) => {
  const brand = req.params.brand;
  const query = { brand: brand };
  const result = await addingProduct.find(query).toArray();
  res.send(result);
});


   // update product by id
   app.put("/updateProduct/:id", async (req, res) => {
    const id = req.params.id;
    const updatedProduct = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        photo: updatedProduct.photo,
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        types: updatedProduct.types,
        price: updatedProduct.price,
        shortDescription: updatedProduct.shortDescription,
        rating: updatedProduct.rating,
      },
    };
    const result = await addingProduct.updateOne(
      filter,
      updateDoc,
      options
    );
    res.send(result);
  });

  
    // myCart get by id 
       app.get("/myCart/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await addingProduct.findOne(query);
        res.send(result);
      });
    
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();mon
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Technology server is running' );
})
app.listen(port, ()=>{
    console.log(`Technology server is running on port:${port}`);
})




