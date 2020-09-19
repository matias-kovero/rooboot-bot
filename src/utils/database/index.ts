import mongoose from 'mongoose';

const db_username = process.env.MONGODB_USERNAME;
const db_password = process.env.MONGODB_PASSWORD;
const db_name = "rooboot";

const uri: string = `mongodb+srv://${db_username}:${db_password}@roobootcluster-se6uw.mongodb.net/${db_name}?retryWrites=true&w=majority`;
const dev_url: string = `mongodb+srv://${db_username}:${db_password}@rooboot.fhndp.mongodb.net/${db_name}?retryWrites=true&w=majority`;
/**
 * Used to cache the database connection
 * between function invocations to prevent
 * overloading the database.
 */
let conn: mongoose.Connection = null;

export const getConnection = async (): Promise<mongoose.Connection> => {
  if(conn == null) {
    conn = await mongoose.createConnection(dev_url, {
      bufferCommands: false, // Rather quit fast than leave hanging -> Waste serverless resources.
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      socketTimeoutMS: 10000 // Need to review this code.
    });
  }

  return conn;
}