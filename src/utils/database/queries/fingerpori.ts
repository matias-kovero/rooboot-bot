import mongoose from 'mongoose';
import { getConnection } from '..';
import FingerporiChat, { IFingerporiChat } from "../models/fingerpori";

export const getChats = async(): Promise<IFingerporiChat[]> => {
  const dbConn = await getConnection();
  const collection: mongoose.Model<IFingerporiChat> = FingerporiChat(dbConn);

  let list: IFingerporiChat[];
  try {
    list = await collection.find().exec();
  } catch (err) {
    console.error(`> getChats error: ${err}`);
  }
  return list;
}

export const addChat = async(chat_id: string) => {
  const dbConn = await getConnection();
  const collection: mongoose.Model<IFingerporiChat> = FingerporiChat(dbConn);
  try {
    const newChat = await collection.findOneAndUpdate({ chat_id: chat_id }, { chat_id }, { upsert: true, useFindAndModify: false } );
    return newChat;
  } catch (err) {
    console.error(`> addChat error ${err}`);
  }
}

export const removeChat = async(chat_id: string) => {
  const dbConn = await getConnection();
  const collection: mongoose.Model<IFingerporiChat> = FingerporiChat(dbConn);
  try {
    const removeChat = await collection.deleteOne({ chat_id: chat_id });
    return removeChat;
  } catch (err) {
    console.error(`> removeChat error ${err}`);
  }
}