const router = require("express").Router();
const Post = require("../models/post");

//create
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    } else {
      res.status(401).json({
        message: "you can only update your post ",
      });
    }
  } catch (error) {
    res.send(500).json(error);
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        
        //to delete the data from the database
        await post.delete();
        //to destroy the image from the cloud
        await cloudinary.uploader.destroy(req.body.photo)       
        res.status(200).json("post has been deleted");
      } catch (err) {
        res.json(err);
        return;
      }
    } else {
      res.status(401).json({
        message: "you can only delete your post ",
      });
    }
  } catch (err) {
    res.send(500).json(err);
  }
});

//get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //to hide the password from the response
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("error");
  }
});

//all post
router.get("/", async (req, res) => {
  const username = req.query.user;
  const categoryname = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (categoryname) {
      posts = await Post.find({
        categories: {
          $in: [categoryname],
        },
      });
    } else {
      posts = await Post.find().sort({ createdAt: -1 }); //getting data in reverse order
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json("error");
  }
});

module.exports = router;
