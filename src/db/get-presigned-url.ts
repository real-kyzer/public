"use server";

import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUrl(formData: FormData) {
  var category = formData.get("category") as string; //crypto.randomUUID();
  var uuid = formData.get("uuid") as string; //crypto.randomUUID();
  const file = formData.get("file") as File;

  // console.log(chalk.yellow(`Generating an upload URL!`));
  const sanatizedFileName = file.name
    .replace(/[^a-z0-9.\-]/gi, "-")
    .replace(/(-)\1+/gi, "-")
    .toLowerCase();

  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `${category}/${uuid}/${sanatizedFileName}`,
      ContentType: file.type,
    }),
    { expiresIn: 60 },
  );

  const data = { url: signedUrl, method: "PUT" };

  // Parse the JSON response.
  //   const data: { url: string; method: "PUT" } = responseJson as any;
  // const metadata = {
  //   planning_scheme_document: {
  //     name: "Document Name",
  //     category: "Category",
  //     summary: "Summary of the document",
  //     pdf_url: "URL to the PDF document",
  //     amendment_link: "URL to the document's amendment",
  //     planning_scheme_links: ["URL 1", "URL 2", "URL 3"],
  //   },
  // };

  const metadata = {
    "document-type": category,
  };

  // Return an object in the correct shape.
  const object = {
    method: data.method,
    url: data.url,
    key: `${category}/${uuid}/${sanatizedFileName}`,
    fields: {}, // For presigned PUT uploads, this should be left empty.
    // Provide content type header required by S3
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `inline; filename="${sanatizedFileName}"`,
      "x-amz-meta-info": JSON.stringify(metadata),
    },
  };

  return object;
}
