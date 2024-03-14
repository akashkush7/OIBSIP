const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI;

const Connection = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connection established");
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = Connection;