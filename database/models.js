module.exports = {
  user: {
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
  }
};