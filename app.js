import "dotenv/config";  
import express from "express";    
import mongoose from "mongoose";      
import postModel from "./models/postSchema.js";
import userModel from './Models/userSchema.js'    
import bcrypt from "bcryptjs";  
import cors from "cors";  
import jwt from "jsonwebtoken";    
import userVerifyMiddle from "./middleware/userVerify.js";  

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const DBURI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

mongoose.connect(DBURI);

mongoose.connection.on("connected", () => console.log("MongoDB Connected"))
mongoose.connection.on("error`", (err) => console.log("MongoDB Err", err))

// signUp Api

app.post("/api/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    if (!firstName || !lastName || !email || !password) {
      res.json({
        message: "required fields are missing",
        status: false,
      });
      return;
    }
  
    const emailExist = await userModel.findOne({ email });
  
    console.log("emailExist", emailExist);
  
    if (emailExist !== null) {
      res.statusCode(304).json({
        message: "email already been registered",
        status: false,
      });
  
      return;
    }
  
    const hashPassword = await bcrypt.hash(password, 10);
  
    console.log("hashPassword", hashPassword);
  
    let userObj = {
      firstName,
      lastName,
      email,
      password: hashPassword,
    };
  
    // create user on db
  
    const createUser = await userModel.create(userObj);
  
    res.statusCode(200).json({
      message: "user create successfully..",
      status: true,
    });
  
    res.send("signup api");
  });
  
  // Login Api
  
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.json({
        message: "required fields are missing",
        status: false,
      });
      return;
    }
  
    const emailExist = await userModel.findOne({ email });
  
    if (!emailExist) {
      res.json({
        message: "Invalid email & password",
        status: false,
      });
      return;
    }
  
    const comparePassword = await bcrypt.compare(password, emailExist.password);
  
    if (!comparePassword) {
      res.json({
        message: "Invalid email & password",
        status: false,
      });
  
      return;
    }
  
    var token = jwt.sign(
      { email: emailExist.email, firstName: emailExist.firstName },
      process.env.JWT_SECRET_KEY
    );
  
    res.json({
      message: "login successfully",
      status: true,
      token,
    });
  });
  
  app.get("/api/getusers", userVerifyMiddle, async (req, res) => {
    try {
      const response = await userModel.find({});
  
      res.json({
        message: "all users get",
        status: true,
        data: response,
      });
    } catch (error) {
      res.json({
        message: error,
      });
    }
  });

// PORT
app.listen(PORT, ()=>{
    console.log(`server is running on http:localhost:${PORT}`)
})



// app.get("/products",(request,response)=>{
//     response.send(data)
// })

// Single Product Get Method
// app.get("/products/:id",(req,res)=>{
//     const singleProduct = req.params;
//     const filterData = data.filter((e , i) => e.id == singleProduct.id)
//     res.send(filterData)
//  })

//  All in One API
// app.get("/products",(req,res)=>{
//     console.log(req.query.id)
//     if(req.query.id){
//         const filterData = data.filter((e , i) => e.id == req.query.id)
//         res.send(filterData)
//         return
//     }
//     res.send(filterData)
//  })

// app.get("/",(request,response)=>{
//     response.send("Server is on Running")
// })

// app.get("/user",(request,response)=>{
//     response.send("Hello User")
// })

// app.get("/" , (req, res) => {
//     res.json("Server Start")
// });

// app.post("/createpost" , async(req, res) => {
//     const {title, desc, postId} =  req.body
//     if(!title || !desc || !postId){
//         res.json({
//             messsage: "Reqired Field are missing"
//         })
//         return
//     }
//     const postObj ={
//         title,
//         desc,
//         postId,
//     }
    
//     const response = await postModel.create(postObj);
//     res.json({
//         messsage: "Post create Successfully",
//         data: response,
//     })
//     res.send("Create Post")
// });


// app.get("/getpost", async (req, res)=> {    
//     // const getData = await postModel.findOne({});  //Top 1 post hi ayega
//   // const getData = await postModel.findById({});  // get data  by id
//   // const getData = await postModel.findByIdAndDelete({});  // get data  by id  and delete it
//   // const getData = await postModel.findByIdAndUpdate({}); // get data  by id and update
//     const getData = await postModel.find({});

//     res.json({
//         messsage:"Post data get successfully",
//         data:getData,
//     })
// })

// app.put("/api/post" , (req, res) => {
//     res.send("Update Post")
// });

// app.delete("/api/post" , (req, res) => {
//     res.send("Delete Post")
// });






