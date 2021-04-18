const express = require('express')
const bodyParser = require('body-parser');
const cors=require('cors');

const MongoClient = require('mongodb').MongoClient;
const objectID=require('mongodb').ObjectID

require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.cnvk9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)




const app = express()

app.use(bodyParser.json())
app.use(cors())
const port = process.env.PORT || 8500;



// console.log(process.env.DB_NAME)


app.get('/', (req, res) => {
  res.send('Ok Boss ,I Come From Wedding Photography')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(error => {

  console.log('connection err',error)

  const serviceCollection = client.db("WeddingPhotography").collection("WeddingPhotography.WEDDING_PHOTOGRAPHY_COLLECTION_1");
  const reviewCollection = client.db("WeddingPhotography").collection("WeddingPhotography.WEDDING_PHOTOGRAPHY_COLLECTION_2");
  const ordersCollection = client.db("WeddingPhotography").collection("WeddingPhotography.WEDDING_PHOTOGRAPHY_COLLECTION_3");


  //packages section

  app.get('/services',(req,res)=>{
    serviceCollection.find()
      .toArray((err,items)=>{
        res.send(items)
        console.log('from database', items)
      })
   })
  
  
  
  
  
    app.post('/addService',(req,res)=>{
       const newEvent=req.body; 
       console.log('adding new event',newEvent);
       serviceCollection.insertOne(newEvent)
       .then(result=>{
           console.log('inserted count',result.insertedCount);
          res.send(result.insertedCount>0)
       })
    })
  
    //checkout 
    app.get('/services/:id',(req,res)=>{
      id=objectID(req.params.id)
      serviceCollection.find({_id:id})
     .toArray((err,items)=>{
       res.send(items[0])
       // console.log('from database', items)
     })
   })



  //review section

 app.get('/feedbacks',(req,res)=>{
  reviewCollection.find()
    .toArray((err,items)=>{
      res.send(items)
      console.log('from database', items)
    })
 })





  app.post('/insertFeedback',(req,res)=>{
     const newEvent=req.body; 
     console.log('adding new event',newEvent);
     reviewCollection.insertOne(newEvent)
     .then(result=>{
         console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount>0)
     })
  })

   //order section
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

 console.log('Database Connected Successfully');

     




});


app.listen(process.env.PORT || port)