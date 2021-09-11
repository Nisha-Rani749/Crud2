const express =require("express")
const mongoose=require("mongoose")
const cors=require('cors')

const Student=require('./models/Students')

const app=express()
//db connections

mongoose.connect(
    "mongodb://localhost:27017/students",
    {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    (err) => {
      if (!err) {
        console.log("DB Connected");
        return;
      }
      console.log(err);
      process.exit(0);
    }
  );

  app.use(cors())
  app.use(express.json())
//routes
app.get('/',(req,res)=>{
  Student.find()
  .exec()
  .then(result=>{
      console.log(result);
      res.status(200).send(result);
  })
  .catch(err=>{
      res.status(500).send(err);
  })
})
app.post('/students',(req,res)=>{
  console.log(req.body.firstname);
  console.log(req.body.lastname);
  console.log(req.body.place);
  const student = new  Student({
      _id : new mongoose.Types.ObjectId,
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      place: req.body.place
  });
  student.save()
  .then(result=>{
      console.log(result);
      res.status(200).json({msg:"succesfully submitted"});
  })
  .catch(err=>{
      console.log(err);
      res.status(500).json({msg:"Error occured"});
  })
})
app.delete('/student/:id',(req,res)=>{
  const id = req.params.id;
  Student.remove({_id:id},(err,result)=>{
      if(err)
      {
          console.log(err);
          res.status(500).send('error occured');
      }
      else{
          res.status(200).json({msg:"successfully deleted"});
      }
  })
})

app.put('/student/:id',(req,res)=>{
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const place = req.body.place;
  const id = req.params.id;
  Student.update({_id:id},{$set:{firstname:firstname,lastname:lastname,place:place}})
  .then(result=>{
      console.log(result);
      res.status(200).json({msg:"successfully updated"});
  })
  .catch(err=>{
      console.log(err);
      res.status(500).json({msg:"error occurred"});
  })
})

//server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening to port <${PORT}>`);
  });
