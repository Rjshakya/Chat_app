import { RequestHandler } from "express";
import Chat from "../../models/chat.model.js";
import mongoose from "mongoose";
import Message from "../../models/message.model.js";
import Recent_Chat from "../../models/recent.chat.model.js";

export const createNewChat: RequestHandler = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        success: false,
        msg: "bad request",
      });
    }

    const { senderId, receiverId } = req?.body;
    let chat = await Chat.findOne({
      $or: [
        {
          sender: new mongoose.Types.ObjectId(senderId),
          receiver: new mongoose.Types.ObjectId(receiverId),
        },
        {
          sender: new mongoose.Types.ObjectId(receiverId),
          receiver: new mongoose.Types.ObjectId(senderId),
        },
      ],
    }).populate("receiver");

    if (!chat) {
      chat = await Chat.create({
        sender: senderId,
        receiver: receiverId,
      });

      
    }

    res.status(201).json({
      msg: "chat created success",
      success: true,
      chat,
    });
  } catch (error) {
    res.status(500).json({
      msg: "server error",
      error,
    });
  }
};

export const getChatDetails: RequestHandler = async (req, res) => {
  try {
    if (!req.query) {
      res.status(400).json({
        msg: "bad request",
        success: false,
      });

      return;
    }

    const { chatID } = req?.query;

    const messages = await Message.find().where({
      chat: new mongoose.Types.ObjectId(chatID?.toString()),
    });

    res.status(200).json({
      success: true,
      msg: "chat found",
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

export const saveInRecentChat: RequestHandler = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        msg: "bad request",
        success: false,
      });
    }

    const { chat, sender, receiver, chatOwner } = req?.body;

    let saved = await Recent_Chat.findOne().where({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
    });

    if (!saved) {
      saved = await Recent_Chat.create({
        chat,
        chatOwner,
        receiver,
        sender,
      });
    }

    res.status(200).json({
      success: true,
      msg: "saved in chat",
      saved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "server error",
      error,
    });
  }
};

export const getRecentChat: RequestHandler = async (req, res) => {
  try {
    if (!req?.query) {
      res.status(400).json({
        msg: "bad request",
        success: false,
      });
    }

    const chatOwner = req?.query?.chatOwner;
    const recent_chats = await Recent_Chat.find()
      .where({
        chatOwner: chatOwner,
      })
      .populate({
        path: "receiver",
        select: "name email picture",
      });

    res.status(200).json({
      success: true,
      msg: "recent chats",
      recent_chats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "server error",
      error,
    });
  }
};
