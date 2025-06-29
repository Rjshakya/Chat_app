import { UserType } from "../../types/common.types.js";
import { Message } from "../socket/socket.service.js";
import { kafkaClient } from "./client.js";

export const produceUserEvent = async (
  last_loggedIn: number,
  online: boolean,
  user: UserType
) => {
  try {
    await kafkaClient.produceUserEvent({
      last_loggedIn,
      online,
      user,
    });
  } catch (error) {
    throw error;
  }
};

export const produceMessage = async (msg: Message) => {
  try {
    await kafkaClient.produceMessage(JSON.stringify(msg));
  } catch (error) {
    throw error;
  }
};
