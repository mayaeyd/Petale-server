import { connect } from "mongoose";

const connectToDB = async () => {
  try {
    await connect(process.env.DATABASE_PATH);
    console.log("Connected to database");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectToDB;
