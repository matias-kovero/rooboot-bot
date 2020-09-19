import mongoose from 'mongoose';

/**
 * Created an interface that extends mongoose.Document. Used later on.
 */
export interface IFingerporiChat extends mongoose.Document {
  chat_id: string;
}
/**
 * Create schema definition
 */
const schema: mongoose.SchemaDefinition = {
  chat_id: { type: mongoose.SchemaTypes.String, required: true }
};

/**
 * Define the name of the collection and the schema using schema definition.
 */
const collectionName: string = "fingerporiChats";
const fpChatsSchema: mongoose.Schema = new mongoose.Schema(schema);

/**
 * To compensate for using serverless we'll generate the Model at runtime using a function. 
 * After declaring the functions, make it the default export
 * @param conn mongoose connection
 */
const FingerporiChat = (conn: mongoose.Connection): mongoose.Model<IFingerporiChat> => 
  conn.model(collectionName, fpChatsSchema);

export default FingerporiChat;