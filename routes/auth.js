const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

//register
router.post("/signup", async (req, res) => {
  try {
    //hashing the password
    const salt  = await bcrypt.genSalt(4618)
    const hashedPass = await bcrypt.hash(req.body.password,salt)
//    creating the object for the database
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save()
    res.status(200).json({ user
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

//login 
router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if(!user){
         res.status(401).json("Invalid credentials!");
         return;
         
      }
  
      const validated = await bcrypt.compare(req.body.password, user.password);
      if(!validated){
        res.status(401).json("Invalid credentials!");
        return
     }
      
  
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports =router