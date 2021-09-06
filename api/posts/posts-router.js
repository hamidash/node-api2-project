// implement your posts router here
const express = require("express");
const postDb = require("./posts-model");

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  postDb
    .find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    postDb.findById(id)
    .then(post => {
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }else{
            res.status(200).json(post);
        }
    }) 
    .catch(err => {
        res.status(500).json({ message: "The post information could not be retrieved" })
    })
})

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  postDb
    .findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        postDb
          .findPostComments(id)
          .then((comments) => {
            if (!comments) {
              res
                .status(404)
                .json({
                  message: "The post with the specified ID does not exist",
                });
            } else {
              res.status(200).json(comments);
            }
          })
          .catch((err) => {
            res
              .status(500)
              .json({
                message: "The comments information could not be retrieved",
              });
          });
      }
    })
    .catch(err => res.status(500).json({ message: "The post information could not be retrieved" }));
});


router.post('/', (req, res) => {
    const {title, contents} = req.body;
   
    if(!title || !contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
        return;
    }
    postDb.insert({title, contents})
    .then(post => {
        res.status(201).json(post)
    })
    .catch(err => {
        res.status(500).json({ message: "There was an error while saving the post to the database" })
    })
})


router.put('/:id', (req, res) => {
    const id = req.params.id;
    const {title, contents} = req.body;


    if(!title || !contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
      postDb.update(id, {title, contents})
      .then(post => {
          if(!post){
              res.status(404).json({ message: "The post with the specified ID does not exist" })
          }else{
              res.status(200).json(post)
          }
      })
      .catch(err => {
          res.status(500).json({ message: "The post information could not be modified" })
      })
    }
})


router.delete('/:id', (req, res) => {
    const id = req.params.id;
    postDb.remove(id)
    .then(post => {
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }else{
                res.status(200).json({
                    message: "Delete successfull",
                    id: id,
                  })
        }
    })
    .catch(err => {
        res.status(500).json({ message: "The post could not be removed" })
    })
})


module.exports = router;
