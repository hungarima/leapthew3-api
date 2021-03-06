const userModel = require("./model");

//Create User
const createUser = ({ username, email, password }) =>
  new Promise((resolve, reject) => {
    userModel
      .create({ username, email, password })
      .then(user => resolve(user._id))
      .catch(err => reject(err));
  });

//Get All Users
const getAllUsers = page =>
  new Promise((resolve, reject) => {
    userModel
      .find({
        active: true
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * 50)
      .limit(50)
      .select("_id username email")
      .exec()
      .then(data =>
        resolve(
          data.map(user =>
            Object.assign({}, user._doc, {
              avatarUrl: `/api/users/${user._id}/avatar`
            })
          )
        )
      )
      .catch(err => reject(err));
  });
  
const getOneUser = id =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({
        active: true,
        _id: id
      })
      .select("_id username email")
      .populate("upvotes", "url leapCount") // test
      .populate("downvotes", "url title description vote") // test
      .populate("saves", "url leapCount") // test
      .exec()
      .then(data =>
        resolve(
          Object.assign({}, data._doc, { avatarUrl: `/api/users/${id}/avatar` })
        )
      )
      .catch(err => reject(err));
  });

const getAvatarData = id =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({
        active: true,
        _id: id
      })
      .select("avatar contentType")
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updateUsername = (id, username) =>
  new Promise((resolve, reject) => {
    userModel
      .update(
        {
          _id: id
        },
        {
          username
        }
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updateEmail = (id, email) =>
  new Promise((resolve, reject) => {
    userModel
      .update(
        {
          _id: id
        },
        {
          email
        }
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updatePassword = (id, password) =>
  new Promise((resolve, reject) => {
    userModel
      .findById(id)
      .then(user => {
        user.password = password;
        return user.save();
      })
      .then(data => resolve(data._id))
      .catch(err => reject(err));
  });

const updateAvatar = (id, avatarFile) =>
  new Promise((resolve, reject) => {
    userModel
      .update(
        {
          _id: id
        },
        {
          avatar: fs.readFileSync(avatarFile.path),
          contentType: avatarFile.mimetype
        }
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const deleteUser = id =>
  new Promise((resolve, reject) => {
    userModel
      .update({ _id, id }, { active: false })
      .exec()
      .then(data => resolve(data._id))
      .catch(err => reject(err));
  });

const getUserForAuth = username =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({ username })
      .select("username password _id")
      .then(user => resolve(user))
      .catch(err => reject(err));
  });

const addUpvote = (userId, urlId) => {
  new Promise((resolve, reject) => {
    userModel
      .update(
        { _id: userId },
        { $push: {upvotes: {_id: urlId}} }
        // TODO: if urlId exists in downvotes => pull
        // TODO: if urlId exists in upvotes => return
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
};

const addDownvote = (userId, urlId) => {
  new Promise((resolve, reject) => {
    userModel
      .update(
        {_id: userId},
        {$push: {downvotes: {_id: urlId}}}
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
};

const saveUrl = (userId, urlId) => {
  return new Promise((resolve, reject) => { // why return here ?
    userModel
      .update(
        { _id: userId },
        { $push: {saves: {_id: urlId}} }
        // TODO: if urlId exists in saves => return
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
};

// Deprecate shares
// const shareUrl = (userId, urlId) => {
//   new Promise((resolve, reject) => {
//     userModel
//       .update(
//         {_id: userId},
//         {$push: {shares: {_id: urlId}}}
//       )
//       .exec()
//       .then(data => resolve(data))
//       .catch(err => reject(err))
//   })
// };
module.exports = {
  createUser,
  getAllUsers,
  getOneUser,
  updateUsername,
  updateEmail,
  updatePassword,
  updateAvatar,
  deleteUser,
  getUserForAuth,
  getAvatarData,
  addUpvote,
  addDownvote,
  saveUrl
};
