import { r2 } from "@/lib/r2";
import {
  GetObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { notFound } from "next/navigation";

export const runtime = "edge";

type Params = {
  category: string;
  uuid: string;
  filename: string;
};

export async function GET(request: Request, context: { params: Params }) {
  const { category, uuid, filename } = context.params;

  try {
    const file = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${category}/${uuid}/${filename}`,
      }),
    );

    //Build the response
    const response = new Response(await file.Body?.transformToWebStream(), {
      status: 200,
      statusText: "ok",
    });

    // Set the content-type
    response.headers.append("content-type", file.ContentType!);
    response.headers.append("cache-control", "no-cache");

    return response;
  } catch (error) {
    // if (!file) return notFound();
    // If no file throw 404
    if ((error as S3ServiceException).name === "NoSuchKey") return notFound();

    return new Response(null, {
      status: 500,
      statusText: "Error",
    });
  }
}
