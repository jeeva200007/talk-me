const mongoose = require("mongoose");
require("dotenv").config();
const uri = `mongodb://talk-now-app:${process.env.DB_PWD}@ac-k28cop4-shard-00-00.ni1unn9.mongodb.net:27017,ac-k28cop4-shard-00-01.ni1unn9.mongodb.net:27017,ac-k28cop4-shard-00-02.ni1unn9.mongodb.net:27017/?ssl=true&replicaSet=atlas-7xi3zv-shard-0&authSource=admin&retryWrites=true&w=majority`;
async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDb connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectToDatabase();
