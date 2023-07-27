const express = require('express');
const app = express();
const path = require('path')
const bodyparser = require('body-parser')
const session = require("express-session")
const nocache = require('nocache')
const mongoDB = require("./config/mongo")

require('dotenv').config();



const port = process.env.PORT || 3000;
mongoDB()
const { v4:uuidv4} = require('uuid')
const admin_route = require('./server/routes/admin_route')
const user_route = require('./server/routes/user_route')


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

// while rendering
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views/user'))
app.set('views',path.join(__dirname,'views/admin'))



//load static files (public/css)
app.use('/assets',express.static(path.join(__dirname,'public/assets_user')))
app.use('/user',express.static(path.join(__dirname,'views/user/')))
app.use('/assets_admin',express.static(path.join(__dirname,'public/assets_admin')))

app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}))
app.use(nocache())


app.use('/',user_route)
app.use('/',admin_route)



app.listen(port,()=>{ console.log("Server on: http://localhost:3000")})