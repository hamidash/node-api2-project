// implement your posts router here
const express = require("express");
const db = require("./posts-model");

const router = express.Router();

router.get("/", (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  db.findPostComments(id)
    .then((comments) => {
      if (!comments) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(comments);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    db.insert({ title, contents })
      .then((newPostId) => {
        const { id } = newPostId;

        db.findById(id)
          .then((newPost) => {
            res.status(201).json(newPost);
          })
          .catch((err) => {
            res.status(500).json({
              message: `Failed to retreive new created post id ${id}`,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    db.findById(id)
      .then((post) => {
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          db.update(id, { title, contents })
            .then((posts) => {
              db.findById(id)
                .then((post) => {
                  res.status(200).json(post);
                })
                .catch((err) => {
                  res.status(500).json({
                    message: `Upodated the post id ${id} but couldn't retreive it`,
                  });
                });
            })
            .catch((err) => {
              res.status(500).json({
                message: "The post information could not be modified",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "The post information could not be modified",
        });
      });
  }
});

router.delete('/:id', (req, res)=> {
    const {id} = req.params;

    db.findById(id)
    .then(post => {
       if(!post){
        res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
        db
        .remove(id)
        .then(deletedPost => {
            res.status(200).json({message:`successfully removed post id ${id}`})
        })
        .catch(err => {
            res.status(500).json({ message: "The post could not be removed" })
        })
       }
    })
    .catch(err => {
        res.status(500).json({message: "Failed to find the the specified post"})
    })
    
})

module.exports = router;
