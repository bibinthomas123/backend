const express = require("express");
const app = express();
const env = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const followRoute = require("./routes/follow");
const cloudinary = require("cloudinary").v2
const morgan = require("morgan")

env.config();
app.use(express.json()); 
app.use(morgan("dev"))

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true
})

//database connection
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to database"))
  .catch((err) => {
    console.log("Error", err);
  });
  
  
  //routes
  app.use("/api/auth", authRoute);
  app.use("/api/users", usersRoute);
  app.use("/api/posts", postRoute);
  app.use("/api/", followRoute);
  
  
//for image storage
//to verify the response given from the frontend
app.get("/api/get-signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp
    },
    cloudinaryConfig.api_secret
  )
  res.json({ timestamp, signature })
})


app.use("*",(req,res,next)=>{
  res.status(404).json({
    status:"Fail",
    message:`Can't Find ${req.originalUrl}`
  })
})
const port = process.env.PORT || 5000

//server port
app.listen(port , () => {
  console.log(`Backend  is running on port ${port}`);
});
