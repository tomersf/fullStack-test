import mongoose from "mongoose";

const connectDB = (url: string | undefined) => {
  if (!url) throw Error("Empty URL for DB connection!");
  url = url.replace(' ', '')
  return mongoose.connect(url,{
    dbName:'persons'
  })
}
export default connectDB;
