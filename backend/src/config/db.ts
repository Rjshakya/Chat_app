import mongoose from "mongoose";

const dbConnection = async (url: string) => {
  mongoose
    .connect(url)
    .then(() => console.log("db is up"))
    .catch((err) => console.log(`db connection error : ${err}`));
};

export default dbConnection