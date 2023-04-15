const { ObjectId } = require("bson");
const mongoCollections = require("../config/mongoCollections");
const User = mongoCollections.users;
const Refresh_token = mongoCollections.refresh_tokens;
const jwtKey = 'car';
const Jwt = require("jsonwebtoken");
const suid = require('rand-token').suid;

async function register(data) {
    const userCollection = await User();
    const insertInfo = await userCollection.insertOne(data);
    return insertInfo;
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
        let token = Jwt.sign(data, jwtKey, { expiresIn: "24h" })
        const Rtoken = suid(64)
        const rTokenCollection = await Refresh_token(Rtoken);
        const findToken = await rTokenCollection.findOne({
            token: Rtoken
        })

        console.log(findToken)

        if (findToken == null) {
            const deleteData = await rTokenCollection.deleteMany({
                userId: insertInfo._id
            });
            const insertToken = await rTokenCollection.insertOne({
                token: Rtoken,
                userId: insertInfo._id
            })
            return { token: token, Rtoken: Rtoken };
        }
        else {
            const deleteData = await rTokenCollection.deleteMany({
                userId: insertInfo._id
            });
            Rtoken = suid(64)
            const insertToken = await rTokenCollection.insertOne({
                token: Rtoken,
                userId: insertInfo._id
            })
            return { token: token, Rtoken: Rtoken };
        }
    } else {
        return "In Valid Email Or Password";
    }
}

module.exports = {
    register,
    login,
};

