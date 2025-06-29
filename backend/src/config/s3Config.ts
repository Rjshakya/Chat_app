import { S3Client } from "@aws-sdk/client-s3";
import envVariables from "./ENV.js";


const { AWSACCESSKEYID ,AWSSECRETACCESSKEYID } = envVariables

const s3 = new S3Client({
    credentials: {
        accessKeyId: AWSACCESSKEYID || "",
        secretAccessKey: AWSSECRETACCESSKEYID || "",
    }
})

export default s3