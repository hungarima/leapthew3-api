const urlModel = require("./model");
const fs = require("fs");

const createUrl = ({ url, title, description, userId }) =>
  new Promise((resolve, reject) => {
    urlModel
      .create({
        url,
        title,
        description,
        createdBy: userId
      })
      .then(data => resolve({ id: data._id }))
      .catch(err => reject(err));
  });

// const getAllUrl = page =>
//   new Promise((resolve, reject) => {
//     urlModel
//       .find({
//         active: true
//       })
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * 20)
//       .limit(20)
//       .select("_id title description createdAt view like")
//       .populate("createdBy", "username avatarUrl")
//       .exec()
//       .then(data => {
//         resolve(
//           data.map(img =>
//             Object.assign({}, img._doc, {
//               imageUrl: `/api/images/${img._id}/data`
//             })
//           )
//         );
//       })
//       .catch(err => reject(err));
//   });

const updateUrl = (id, { url, title, description }) =>
  new Promise((resolve, reject) => {
    urlModel
      .update(
        {
          _id: id
        },
        {
          url,
          title,
          description
        }
      )
      .then(data => resolve({ id: data._id }))
      .catch(err => reject(err));
  });

const deleteUrl = (id, userId) =>
  new Promise((resolve, reject) => {
    urlModel
      .update(
        {
          _id: id,
          // createdBy: userId
        },
        { active: false }
      )
      .then(data => resolve({ id: data }))
      .catch(err => reject({ status: 500, err }));
  });

const getUrl = id =>
  new Promise((resolve, reject) => {
    urlModel
      .update(
        {
          active: true,
          _id: id
        },
        {
          $inc: {
            view: 1
          }
        }
      )
      .then(result =>
        urlModel
          .findOne({
            active: true,
            _id: id
          })
          .select("_id title description createdAt leapCount vote")
          // .populate("comment.createdBy", "username avatarUrl")
          // .populate("createdBy", "username avatarUrl")
          .exec()
      )
      .then(data =>
        resolve(
          Object.assign({}, data._doc, { url: `/api/url/${id}/data` })
        )
      )
      .catch(err => reject(err));
  });

const getUrlData = id =>
  new Promise((resolve, reject) => {
    urlModel
      .findOne({
        active: true,
        _id: id
      })
      .select("url contentType")
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

// const addComment = (imageId, { userId, content }) =>
//   new Promise((resolve, reject) => {
//     imageModel
//       .update(
//         {
//           _id: imageId
//         },
//         {
//           $push: { comment: { createdBy: userId, content } }
//         }
//       )
//       .then(data => resolve(data))
//       .catch(err => reject(err));
//   });

// const deleteComment = (imageId, commentId, userId) =>
//   new Promise((resolve, reject) => {
//     imageModel
//       .update(
//         {
//           _id: imageId
//         },
//         {
//           $pull: { comment: { _id: commentId, createdBy: userId } }
//         }
//       )
//       .then(data => resolve(data))
//       .catch(err => reject(err));
//   });

const upVote = urlId =>
  new Promise((resolve, reject) => {
    urlModel
      .update(
        {
          _id: urlId
        },
        {
          $inc: { vote: 1 }
        }
      )
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const downVote = urlId =>
  new Promise((resolve, reject) => {
    urlModel
      .update(
        {
          _id: urlId
        },
        {
          $inc: { vote: -1 }
        }
      )
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

module.exports = {
  createUrl,
  getUrl,
  updateUrl,
  deleteUrl,
  getUrlData,
  upVote,
  downVote,
};
