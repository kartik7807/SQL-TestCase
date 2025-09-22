const { faker } = require('@faker-js/faker');
const mysql=require("mysql2");
const express=require("express");
const app=express();
const path=require("path");
//const { count } = require('console');
const methodOverride=require("method-override");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));


const connection =mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'Delta_connection',
  password:"Kartik@5369",
});

let getRandomUser=()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password()
  ];
};


app.get("/",(req,res)=>{
  let q= "SELECT count(*) FROM user";
  try {
connection.query(q,(err, result)=>{
  if (err)throw err;
  let count=result[0]["count(*)"];
  res.render("home.ejs", {count});
  console.log(result);
});
} catch(err) {
  console.log(err);
  console.log("some error in DB");
}
});

//show data rout
app.get("/user",(req,res)=>{
  let q="SELECT * FROM user";
    try {
      connection.query(q,(err, users)=>{
      if (err)throw err;
      //console.log(result);
      res.render("showUser.ejs",{users});
      });
    }catch(err) {
      console.log(err);
      console.log("some error in DB");
}
});

//Edit rout
app.get("/user/:id/edit",(req,res)=>{
  let {id} =req.params;
  let q= `SELECT * FROM user WHERE id='${id}'`;
  try {
connection.query(q,(err, result)=>{
  if (err)throw err;
  let user=result[0];
  res.render("edit.ejs",{user});
});
} catch(err) {
  console.log(err);
  console.log("some error in DB");
}
  
});
// UPDATE
app.patch("/user/:id",(req,res)=>{
  let {id} =req.params;
  let {password:formpass, name:newname}=req.body;
  let q= `SELECT * FROM user WHERE id='${id}'`;
  
  try {
connection.query(q,(err, result)=>{
  if (err)throw err;
  let user=result[0];
  if(formpass!=user.password){
  res.send("Wrong Password");
  }else{
    let q2=`UPDATE user SET name ='${newname}' WHERE id='${id}'`;
    connection.query(q2,(err, result)=>{
  if (err)throw err;
  res.redirect("/user");
  });
}
});
} catch(err) {
  console.log(err);
  console.log("some error in DB");
}
});

//adding add button
app.post("/user/new",(req, res)=>{
  res.render("add.ejs");
});

//adding data
app.post("/user/add",(req, res)=>{
  const id =req.body.id;
  const name =req.body.name;
  const email=req.body.email;
  const password=req.body.password;

 let q = `INSERT INTO user (id,name, email, password) VALUES ('${id}','${name}','${email}','${password}') `;

  try {
      connection.query(q,(err, result)=>{
      if (err)throw err;
      console.log(result);
      res.redirect("/user");
      });
    }catch(err) {
      console.log(err);
      console.log("some error in DB");
}
});

// delete route
app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let q2 = `DELETE FROM user WHERE id='${id}'`;

  try {
    connection.query(q2, (err, result) => {
      if (err) throw err;
      console.log(`Deleted user with id: ${id}`);
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});


app.listen("8080",()=>{
    console.log("listening on port 8080");
})



