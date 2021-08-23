
const express = require('express');
 const bodyParser = require('body-parser');
 const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxbrw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
 

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;



 
 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 
  const productsCollection= client.db("ema-john").collection("products");
  const ordersCollection= client.db("ema-john").collection("orders");
  
  app.post('/addProduct', (req,res) => {
   
    const products = req.body
    productsCollection.insertOne(products)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
        
    })
  })

  app.get('/products', (req, res) => {
    const search = req.query.search
          productsCollection.find({name: {$regex:search}}).limit(20)
          .toArray((err, documents) =>{
            res.send(documents)
       })
    })

  app.get('/product/:key', (req, res) => {
          productsCollection.find({key: req.params.key})
          .toArray((err, documents) =>{
            res.send(documents[0])
       })
    })

  app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
          productsCollection.find({key:{$in:productsKeys}})
          .toArray((err, documents) =>{
            res.send(documents)
       })
    })

    app.post('/addOrder', (req,res) => {
   
      const order = req.body
      ordersCollection.insertOne(order)
      .then(result => {
          res.send(result.insertedCount > 0)
          
      })
    })

})



app.listen(process.env.PORT || port)










