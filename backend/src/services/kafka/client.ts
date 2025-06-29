import { Kafka } from "kafkajs";

import Message from "../../models/message.model.js";
import User from "../../models/user.model.js";
import mongoose from "mongoose";

import { UserType } from "../../types/common.types.js";
import kafka from "../../config/kafkaConfig.js";
interface UserEvent {
  user: UserType;
  last_loggedIn: number;
  online: boolean;
}

class KafkaClient {
  private kafka: Kafka | null = null;

  constructor() {
    this.kafka = kafka;
  }

  public async produceMessage(messages: string) {
    try {
      const producer = this.kafka?.producer();
      await producer?.connect();

      await producer?.send({
        topic: "CHAT_MESSAGES",
        messages: [{ key: `chat_msg-${Date.now()}`, value: messages }],
      });

      await producer?.disconnect();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async consumeMessage() {
    try {
      const consumer = this.kafka?.consumer({ groupId: "chat_msgs" });
      await consumer?.connect();

      await consumer?.subscribe({
        topic: "CHAT_MESSAGES",
        fromBeginning: true,
      });

      await consumer?.run({
        eachMessage: async ({ topic, message, pause }) => {
          if (!message) return;

          try {
            let msg = JSON.parse(message.value?.toString()!);

            await Message.create(msg);
          } catch (error) {
            console.log(error, "wrong with db");
            pause();

            setTimeout(() => {
              consumer.resume([{ topic: "CHAT_MESSAGES" }]);
            }, 60 * 1000);
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async produceUserEvent(event: UserEvent) {
    const producer = this.kafka?.producer();

    try {
      await producer?.connect();
      await producer?.send({
        topic: "USER_ACTIVITY",
        messages: [
          {
            key: `user-${Date.now()}`,
            value: JSON.stringify(event),
          },
        ],
      });

      await producer?.disconnect();
    } catch (error) {
      console.log("failed to produce user activity", error);
      throw error;
    }
  }

  public async consumeUserEvent() {
    const consumer = this.kafka?.consumer({ groupId: "user-events" });

    try {
      await consumer?.subscribe({
        topic: "USER_ACTIVITY",
        fromBeginning: true,
      });
      await consumer?.run({
        eachMessage: async ({ topic, message, pause }) => {
          if (!message) return;

          try {
            let msg = JSON.parse(message.value?.toString()!) as UserEvent;
            await User.findByIdAndUpdate(
              new mongoose.Types.ObjectId(msg.user.id),
              {
                last_loggedIn: msg.last_loggedIn,
                isOnline: msg?.online,
              }
            );
          } catch (error) {
            console.log(error, "wrong with db");
            pause();

            setTimeout(() => {
              consumer.resume([{ topic: "USER_ACTIVITY" }]);
            }, 100 * 1000);
          }
        },
      });
    } catch (error) {
      console.log("failed to consume user's events", error);
      throw error;
    }
  }
}

export const kafkaClient = new KafkaClient();
