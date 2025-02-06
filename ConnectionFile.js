const {MongoClient} = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');

async function dbConnect(){
    let result = await client.connect();
    let database = result.db('myFirst');
    return database.collection('School');
}
module.exports = dbConnect;