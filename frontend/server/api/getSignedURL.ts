import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const config = useRuntimeConfig();
const s3 = new S3Client({
  region: config.awsBucketRegion!,
  credentials: {
    accessKeyId: config.awsAccessKey!,
    secretAccessKey: config.awsSecretAccessKey!,
  },
});

const acceptFileTypes = ["image/png", "image/jpeg"];

const maxFileSize = 1024 * 1024 * 10; // 10MB

const generateFileName = (bytes = 32) => {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
};

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const { isLogin, fileName, fileType, size, checksum } = data;
  // auth
  if (!isLogin) {
    return {
      failure: "Not authenticated",
    };
  }

  if (!acceptFileTypes.includes(fileType)) {
    return {
      failure: "Invalid file type",
    };
  }

  if (size > maxFileSize) {
    return {
      failure: "File too large",
    };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: config.awsBucketName!,
    Key: generateFileName(),
    ContentType: fileType,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return {
    success: { url: signedURL },
  };
});
