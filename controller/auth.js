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
            // const deleteData = await rTokenCollection.deleteMany({
            //     userId: insertInfo._id
            // });
            const insertToken = await rTokenCollection.insertOne({
                token: Rtoken,
                userId: insertInfo._id
            })
            return { token: token, Rtoken: Rtoken };
        }
        else {
            // const deleteData = await rTokenCollection.deleteMany({
            //     userId: insertInfo._id
            // });
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

async function getRefreshToken(data) {
    const rTokenCollection = await Refresh_token();
    const findToken = await rTokenCollection.findOne({
        token: data.Rtoken,
        userId: new ObjectId(data.userId)
    })
    if (findToken) {
        const userCollection = await User();
        const userInfo = await userCollection.findOne(
            {
                _id: new ObjectId(data.userId),
            }
        )
        let jwtData = {
            email: userInfo.email,
            password: userInfo.password
        }
        let token = Jwt.sign(jwtData, jwtKey, { expiresIn: "24h" })
        const Rtoken = suid(64)
        const updateData = await rTokenCollection.updateOne(
            {
                userId: new ObjectId(data.userId)
            },
            {
                $set: {
                    token: Rtoken
                }
            }
        )
        return { token: token, Rtoken: Rtoken };
    }
    else {
        return "In Valid Token";
    }
}
async function logout(data) {
    const rTokenCollection = await Refresh_token();
    const deleateData = await rTokenCollection.deleteOne(
        {
            userId: new ObjectId(data.userId),
            token: data.token
        }
    )
    return "Logout successfully"
}

module.exports = {
    register,
    login,
    getRefreshToken,
    logout
};

