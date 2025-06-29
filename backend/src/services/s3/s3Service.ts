import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  PutObjectCommandOutput,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import s3 from "../../config/s3Config.js";

interface Is3Services {
  upload(
    file: File,
    Key: string,
    ContentType: string
  ): Promise<PutObjectCommandOutput>;
  getObject(Key: string): Promise<GetObjectCommandOutput>;
}

class s3Services implements Is3Services {
  private readonly s3: S3Client;
  private readonly bucket: string;
  constructor(s3Client: S3Client) {
    if (!s3Client) {
      throw new Error("s3 client is required");
    }
    this.s3 = s3Client;
    this.bucket = "";
  }

  public async upload(
    file: File | Buffer,
    Key: string,
    ContentType: string
  ): Promise<PutObjectCommandOutput> {
    this.validateParams(Key, file);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key,
      Body: file,
      ContentType,
    });

    try {
      const response = await this.s3.send(command);
      return response;
    } catch (error) {
      throw new Error("failed to upload in s3");
    }
  }

  public async getObject(Key: string): Promise<GetObjectCommandOutput> {
    this.validateParams(Key);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key,
    });

    try {
      const response = await this.s3.send(command);
      return response;
    } catch (error) {
      throw new Error(`error : ${error}`);
    }
  }

  private validateParams(Key?: string, Body?: File | Buffer): Error | void {
    if (!Key || !Body) {
      throw new Error("s3 error : params : required ");
    }
  }
}

const s3ServicesInstance = new s3Services(s3);
export default s3ServicesInstance;
