const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name: { type: String, required: true},
    lastName: { type: String, required: true},
    nickName: { type: String, required: true},
    email: { type: String, required: false},
    password: { type: String, required: false},
    status: { type: String, required: true}
});
const User = mongoose.model('User', UserSchema);
module.exports = User;