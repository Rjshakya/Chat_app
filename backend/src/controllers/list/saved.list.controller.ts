import { RequestHandler } from "express";
import Saved_List_Model from "../../models/recent.chat.model.js";

export const createList: RequestHandler = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload) {
      res.status(405).json({
        success: false,
        msg: "bad request",
      });

      return;
    }

    const { creator, list_member, title } = payload;
    const list = await Saved_List_Model.create({
      creator,
      list_members: [list_member],
      title,
    });

    res.status(200).json({
      success: true,
      msg: "list created and user added to list",
      list,
    });

    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      msg: "server error",
    });
  }
};

export const addInList: RequestHandler = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload) {
      res.status(405).json({
        success: false,
        msg: "bad request",
      });

      return;
    }

    const { list_id, member } = payload;
    const updatedList = await Saved_List_Model.findByIdAndUpdate(
      list_id,
      { $addToSet: { list_members: member } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "updated",
      list: updatedList,
    });

    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "server error",
    });
  }
};
