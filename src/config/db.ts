import mongoose from "mongoose";
const DB_URL = "mongodb://localhost/elm_database";
class db {
  static connect(): void{
    mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    mongoose.connection.on("connected", function () {
      console.log("mongoose connected success", DB_URL);
    });

    mongoose.connection.on("error", function (err) {
      console.log("mongoose connected error", err);
    });

    mongoose.connection.on("disconnected", function () {
      console.log("mongoose connected disconnected");
    });
  }
}

export default db;