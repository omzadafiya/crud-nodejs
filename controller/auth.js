const { ObjectId } = require("bson");
const mongoCollections = require("../config/mongoCollections");
const User = mongoCollections.users;
const jwtKey = 'car'
const Jwt = require("jsonwebtoken");

async function register(data) {
    const userCollection = await User();
    const insertInfo = await userCollection.insertOne(data);
    return result;
    // Jwt.sign({ result }, "jwtKey", (err, token) => {
    //     return token
    // })
}
async function login(data) {
    const userCollection = await User();
    const insertInfo = await userCollection.findOne(
        {
            email: data.email,
            password: data.password
        }
    )
    if (insertInfo) {
        let token = Jwt.sign(data, jwtKey)
        return token;

    } else {
        return "In Valid Email Or Password";
    }

}


module.exports = {
    register,
    login
};