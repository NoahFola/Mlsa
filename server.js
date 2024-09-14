const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path")
const app = express();
const mongoose = require("mongoose");
const { error } = require("console");
app.use(express.static("public"));

app.set('view engine', 'ejs')

let items = [];
let date;
date = new Date();
let Dayy = date.toLocaleString('en-US', { weekday: 'long' , day: 'numeric' , month: 'long'});
let a;
let current_logged_in_user;

const db_url = "mongodb+srv://Noah_Fola:9kEQT5iRmCMnbExG@myfirstcluster.xlzno.mongodb.net/toDoApp?retryWrites=true&w=majority&appName=MyFirstCluster"

async function connectToDatabase() {
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 50000,
        });
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

connectToDatabase();

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    toDo: []
});

const User = mongoose.model("user", userSchema);




async function getUsers() {
    connectToDatabase();
    try {
      const users = await User.find({}); // no callback needed
      //console.log(users);
      return users;
    } catch (err) {
      console.log('Error fetching users:', err);
    }
    
};

// getUsers();


app.use(bodyParser.urlencoded({extended: true}))

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html")
});

app.get("/getLogin",(req,res)=>{
    res.sendFile(__dirname + "/login.html")
});

app.get("/getSignUp",(req,res)=>{
    res.sendFile(__dirname + "/signup.html")
});


app.post("/ejs", (req,res)=>{
    items = [];
    let username_list = [];
    
    getUsers().then((a)=>{
            items = [];
            console.log(a);
            username_list = [];
            for (var instance of a){
                username_list.push(instance.username);
            }
            let signUp_username = req.body.signUp_username;
            let signUp_password = req.body.signUp_password;
            if(signUp_username != undefined){
                console.log(signUp_username);
                console.log(username_list); 
            
                if(username_list.indexOf(signUp_username) == -1 ){
                    console.log("true");
                    let user = new User({
                        username: signUp_username,
                        password: signUp_password,
                        toDo: []
                    });
                    connectToDatabase();
                    user.save();
                    res.render("index", {Day: Dayy , items:items});
                    current_logged_in_user = signUp_username;
                }
                else{
                    console.log("false");
                    res.redirect("/getSignUp?signUp_error=ExistingUsername");
            }
            }
            let login_username = req.body.login_username;
            let login_password = req.body.login_password;
            if(login_username != undefined){
                if(username_list.indexOf(login_username) != -1 ){
                    let login_index = username_list.indexOf(login_username);
                    let login_obj = a[login_index];
                    if(login_obj.password == login_password){
                        items = login_obj.toDo;
                        res.render("index", {Day: Dayy , items:items});
                        current_logged_in_user = login_username
                    }else{
                        res.redirect('/getLogin?login_error=invalidPassword');
                    }
                }else{
                    res.redirect('/getLogin?login_error=noUsername');
                }
            }
        }
    );

   

    

});

app.get("/ejs", (req,res)=>{
    res.render("index", {Day: Dayy , items:items});
});



app.post("/json/", (req,res)=>{
    let item = req.body;
    console.log(item);
    let keys = Object.keys(item);
    for (var key of keys){
        let keyCount = items.indexOf(key);
        items.splice(keyCount,1)
        res.redirect("/ejs")
    }

});


app.post("/", (req,res)=>{
    getUsers().then((a)=>{
        let username_list = [];
        for (var instance of a){
            username_list.push(instance.username);
        }
        let index_number = username_list.indexOf(current_logged_in_user);
        console.log(current_logged_in_user);

        let current_obj = a[index_number];

        let current_list = current_obj.toDo;
        let item = req.body.input;
        if(item == "" || current_list.includes(item)){
            res.redirect("/ejs");
        }
        else{
        current_list.push(item);
        res.render("index" ,{Day: Dayy , items:current_list});
        };
        });
});



app.listen(3000, ()=>{
    console.log("working")
});

