const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true
}
const reqNumber = {
    type: Number,
    required: true
}

const userSchema = new mongoose.Schema({
    username: reqString,
    password: reqString,
    email: reqString,
    permission: String
},
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema);