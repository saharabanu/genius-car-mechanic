const express= require('express');
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId;
var cors = require('cors')
require('dotenv').config();
const app =express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jy11d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
   try {
    await client.connect();
    // console.log('connect to database')
    const database = client.db("carMechanic");
    const servicesCollecion = database.collection("services");
    // GEt api  
    app.get('/services',async(req,res)=>{
        const cursor = servicesCollecion.find({});
        const services= await cursor.toArray();

        res.send(services)

    })
    // single get Api 
    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        console.log('service id',id)
        const query = { _id:ObjectId(id) };
        const service = await servicesCollecion.findOne(query);
        res.json(service)
    })

    // POST API 
    app.post('/services', async (req,res)=>{
        const service = req.body;
       console.log('hit the post api',service)
       
        const result = await servicesCollecion.insertOne(service);
        console.log(result)
       res.json(result)
     
    })
    // update api 
    app.put('/services/:id',async(req,res)=>{
        const id = req.body;
        console.log('updated data added',id)
        res.send('getting soon')
    })
    // delete api  
    app.delete('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const result = await servicesCollecion.deleteOne(query);
        res.json(result);

    })
    
   }
   finally {

   }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running Genius Server');
})
app.listen(port,()=>{
    console.log('Running Genius Server',port)
})