const  mongoose  = require("mongoose");

const CarSchema = mongoose.Schema({
    name: String,
    color: String,
    brand: String,
    price: Number
});
module.exports = mongoose.model('cars', CarSchema)