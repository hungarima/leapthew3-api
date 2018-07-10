const express = require("express");
const router = express.Router();


const urlController = require("./controller");
const authMiddleware = require("../auth/auth");


router.get("/", (req, res) => {
  urlController
    .getUrl(req.query.page || 1)
    .then(url => res.send(url))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/:urlId", (req, res) => {
  urlController
    .getUrl(req.params.urlId)
    .then(url => {
      res.send(url)
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

// router.get("/:imageId", (req, res) => {
//   imageController
//     .getImage(req.params.imageId)
//     .then(image => res.send(image))
//     .catch(err => {
//       console.error(err);
//       res.status(500).send(err);
//     });
// });

router.get("/:urlId/data", (req, res) => {
  imageController
    .getUrlData(req.params.imageId)
    .then(data => {
      res.contentType(data.contentType);
      res.send(data.image);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post(
  "/",
  // authMiddleware.authorize
  
  (req, res) => {
    console.log("blah")
    req.body.userId = req.session.userInfo.id;

    urlController
      .createUrl(req.body)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  }
);

router.delete("/:id", authMiddleware.authorize, (req, res) => {
  urlController
    .deleteUrl(req.params.id, req.session.userInfo.id)
    .then(url => res.send(image))
    .catch(error => {
      console.error(error);
      res.status(error.status).send(error.err);
    });
});

// router.post("/:urlId/comments", authMiddleware.authorize, (req, res) => {
//   req.body.userId = req.session.userInfo.id;

//   imageController
//     .addComment(req.params.imageId, req.body)
//     .then(result => res.send(result))
//     .catch(err => {
//       console.error(err);
//       res.status(500).send(err);
//     });
// });

// router.delete(
//   "/:imageId/comments/:commentId",
//   authMiddleware.authorize,
//   (req, res) => {
//     imageController
//       .deleteComment(
//         req.params.imageId,
//         req.params.commentId,
//         req.session.userInfo.id
//       )
//       .then(result => res.send(result))
//       .catch(err => {
//         console.error(err);
//         res.status(500).send(err);
//       });
//   }
// );

router.post("/:urlId/upvote", authMiddleware.authorize, (req, res) => {
  urlController
    .upVote(req.params.urlId)
    .then(result => res.send(result))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.delete("/:urlId/like", authMiddleware.authorize, (req, res) => {
  urlController
    .downVote(req.params.imageId)
    .then(result => res.send(result))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

module.exports = router;
