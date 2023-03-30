const  mongoose  = require("mongoose");

const userSchema = mongoose.Schema({
    name:String,
    password:String,
    gender:String,
    age:Number,
    email:String
});

module.exports = mongoose.model('users',userSchema);