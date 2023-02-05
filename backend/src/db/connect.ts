import mongoose from "mongoose";
import { promisify } from "util";

const connectDB = (url: string | undefined) => {
  if (!url) throw Error("Empty URL for DB connection!");
  url = url.replace(' ', '')
  return mongoose.connect(url,{
    dbName:'persons'
  })
}
export default connectDB;
