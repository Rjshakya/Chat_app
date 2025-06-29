import { RequestHandler } from "express";
import Group from "../../models/group.model.js";
import mongoose from "mongoose";

export const createGroup: RequestHandler = async (req, res) => {
  if (!req?.body) {
    res.status(400).json({
      msg: "bad request",
      success: false,
    });
  }

  try {
    const { admin, members, title } = req?.body;

    const group = await Group.create({
      admin,
      members,
      title,
    });
50
    if (!group) {
      res.status(503).json({
        mag: "failed to create group",
        success: false,
      });
    }

    res.status(201).json({
      success: true,
      msg: "group created successfuly",
      group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mag: "server error",
      error,
    });
  }
};

export const getUserGroup: RequestHandler = async (req, res) => {
  if (!req?.query) {
    res.status(400).json({
      success: false,
      msg: "bad request",
    });
  }

  try {
    const { user } = req?.query;

    const groups = await Group.find({
      members: new mongoose.Types.ObjectId(`${user}`),
    });

    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error",
      error,
    });
  }
};

export const getGroup: RequestHandler = async (req, res) => {
  if (!req?.query) {
    res.status(400).json({
      success: false,
      msg: "bad request",
    });

    return;
  }

  try {
    const { id } = req?.query;
  
    
    const group = await Group.findById(id);

    if (!group) {
      res.status(404).json({
        msg: "no  group found",
        success: false,
      });

      return;
    }

    res.status(200).json({
      success: true,
      group,
    });

    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error",
      error,
    });
  }
};
