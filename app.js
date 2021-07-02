
const express= require('express')
const methodOverride=require('method-override')
const app=express()
const bodyParser= require('body-parser')
const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost/user_schema" ,{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true ,useFindAndModify:false});
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(methodOverride("_method"))

//SCHEMA

const userSchema=new mongoose.Schema({
    id:{
        type:Number,
        require:true,
        unique:true
    },
    userName:{
       type: String,
       required:true
    },

    fullName:String,
    email: {
        type: String,
        lowercase: true,
    }

})
const User=mongoose.model("User",userSchema);

//ROUTES 

app.get('/',(req,res)=>{
    res.redirect('/getUsers')
    
})

app.get('/getUsers',(req,res)=>{
 User.find({},(err,users)=>{
        if(err)res.status(404).send(err)
        else res.render('users',{users:users})
    })
})

app.get('/createUser',(req,res)=>{
    res.render('newUser')
})

app.post('/createUser',(req,res)=>{
User.create( req.body.user,(err,blog)=>{
if(err)res.render('/createUser')
else res.redirect('/getUsers')  
})
})

app.get('/getUsers/:id',(req,res)=>{
    
    User.findById(req.params.id,(err,foundUser)=>{
        if(err)res.redirect('/getUsers')
        else res.render('userById',{user:foundUser})
    })

})
app.get('/getUsers/:id/edit',(req,res)=>{
    User.findById(req.params.id,(err,foundUser)=>{
        if(err)res.redirect('/getUsers')
        else res.render('editEmail',{user:foundUser})
    })
})
app.put('/getUsers/:id',(req,res)=>{
    User.findByIdAndUpdate(req.params.id,req.body.user,(err,updatedUser)=>{
        if(err)res.redirect('/getUsers')
        else res.redirect('/getUsers/'+req.params.id)
    })
})
app.get('/searchUserByName',(req,res)=>{
   
   const regex = new RegExp(req.query.fullName, 'i') 

    User.find({fullName: {$regex: regex}},(err,foundUser)=>{
        if(err)res.redirect('/getUsers')
        else {   if(foundUser.length)
            res.render('viewUsers',{users:foundUser})
         else res.send('no match found')
        }
    })

})
app.get('/searchUser',(req,res)=>{
    res.render('searchUserByName')
})


const port=process.env.PORT||3000
app.listen(port,()=>{
    console.log('running');
})