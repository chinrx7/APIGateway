const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cfg = require('dotenv').config();

const dburl = cfg.parsed.MONGO_URL;
const dbname = cfg.parsed.MONGO_PREFIX + 'SOLAR_CFG';

module.exports.Login = async (user, password) => {

    const client = new MongoClient(dburl);

    const database = client.db(dbname);

    const USR = database.collection('SYS_USERS');

    const query = { UserName: user };

    const users = await USR.findOne(query);

    if (users) {
        const auth = await bcrypt.compare(password, users.Password);
        if (auth) {
            await client.close();
            return jwtGenToken(users);
        }
        else {
            await client.close();
            return "Incorrect user or password";
        }
    } else {
        await client.close();
        return false;
    }
}

module.exports.ValidateToken = (token) => {
    let validation;
    jwt.verify(token, process.env.ACCESS_SECRET, (err, decode) => {
        if (!err) {
            validation = true;
        }
        else {
            validation = false;
        }
    })

    return validation;
}

const jwtGenToken = (user) => {
    const tokenTime = process.env.SYSTEM_TOKEN_TIME;
    const accessToken = jwt.sign(
        { UserName: user.UserName, _id: user._id },
        process.env.ACCESS_SECRET,
        { expiresIn: tokenTime, algorithm: "HS256" }
    )
    return accessToken;
}