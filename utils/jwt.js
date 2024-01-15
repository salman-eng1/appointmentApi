var jwt = require('jsonwebtoken');

exports.decoded =async  (token) => jwt.verify(token, "dev@1hg@3467@ops")