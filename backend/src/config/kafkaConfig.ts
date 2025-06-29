import { Kafka } from "kafkajs";
import path from "path";
import fs from "fs"

const kafka = new Kafka({
      clientId: "socket_app_msg_broker",
      brokers: [`${process.env.KAKFA_BROKER_1}`],
      sasl: {
        mechanism: "plain",
        username: `${process.env.KAFKA_USERNAME}`,
        password: `${process.env.KAFKA_PASS}`,
      },
      ssl: {
        ca: [fs.readFileSync(path.resolve("./aiven.pem"), "utf-8")],
        rejectUnauthorized: false,
      },
    })

export default kafka