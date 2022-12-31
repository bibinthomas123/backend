const User = require("../models/user");
const router = require("express").Router();

//follow and unfollow



router.patch("/follow/", async (req, res) => {
   if (req.body.username === req.body.following){
    res.status(401).json({message:"user cannot follow his own account"})
   }else{
    try {
      username = req.body.username;
      followerId = req.body.following;
      let whomFollowed = await User.findByIdAndUpdate(username, {
        $addToSet: { following: followerId }, 
      });
      let whoFollowedMe = await User.findByIdAndUpdate(followerId, {
        $addToSet: { followers: username },
      });
      return res.status(200).send({ message: "User Follow Success" });
    } catch (e) {
      return res
        .status(500)
        .send({ message: "User Follow Failed", data: e.message });
    }
   }
});

router.patch("/unfollow/", async (req, res) => {
  try {
    username = req.body.username;
    followerId = req.body.following;
    let whomUnFollowed = await User.findByIdAndUpdate(username, {
      $pull: { following:followerId },
    });
    let whoUnFollowedMe = await User.findByIdAndUpdate(followerId, {
      $pull: { followers: username },
    });
    return res.status(200).send({ message: "User UnFollow Success" });
  } catch (e) {
    return res
      .status(500)
      .send({ message: "User UnFollow Failed", data: e.message });
  }
});

module.exports = router;
