import { RequestHandler } from "express";
import Message from "../../models/message.model.js";
import mongoose from "mongoose";
import { getStartandEnd } from "../../lib/date.js";

export const getChatMessages: RequestHandler = async (req, res) => {
  try {
    const senderID = req?.query?.sender;
    const receiverID = req?.query?.receiver;

    const { startTz, endTZ } = getStartandEnd();

    const messages = await Message.find({
      $and: [
        {
          $or: [
            {
              sender: new mongoose.Types.ObjectId(`${senderID}`),
              receiver: new mongoose.Types.ObjectId(`${receiverID}`),
            },
            {
              sender: new mongoose.Types.ObjectId(`${receiverID}`),
              receiver: new mongoose.Types.ObjectId(`${senderID}`),
            },
          ],
        },
        {
          createdAt: { $gte: startTz, $lte: endTZ },
        },
      ],
    });

    if (!messages) {
      res.status(404).json({
        success: false,
        error: true,
        msg: "no messages found for the chat",
      });
    }

    res.status(200).json({
      success: true,
      msg: "messages found",
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: true,
      msgL: "server in getting messages",
    });
  }
};

export const getGroupMessages: RequestHandler = async (req, res) => {
  try {
    if (!req?.query) {
      res.status(400).json({
        msg: "bad request",
        success: false,
      });

      return;
    }
    const { group } = req?.query;

    const messages = await Message.find({
      group: new mongoose.Types.ObjectId(`${group}`),
      
    }).populate("sender")

    if (!messages) {
      res.status(404).json({
        success: false,
        error: true,
        msg: "no messages found for the chat",
      });
    }

    res.status(200).json({
      success: true,
      msg: "messages found",
      messages,
    });

    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "server error",
      error,
    });

    return;
  }
};
