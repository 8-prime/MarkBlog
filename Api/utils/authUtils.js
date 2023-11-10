const jwt = require("jsonwebtoken");

function userIdFromReq(req) {
    try {
        let token = req.get("authorization");
        if (!token) {
            console.log("No Token found");
            return undefined;
        }
        token = token.split(" ")[1];
        const { _id } = jwt.decode(token);
        console.log("Token Id Value:", _id);
        return _id;
    } catch (error) {
        return undefined;
    }
}

module.exports = { userIdFromReq }