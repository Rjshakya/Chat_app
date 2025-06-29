import { Redis } from "ioredis";

const redis_uri = `${process.env.REDIS_URI}`;
const client = new Redis(redis_uri);




// export default client;
