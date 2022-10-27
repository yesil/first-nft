import express from "express";
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

const app = express();
const port = 3000;

const endpoint = "https://s3.filebase.com";
const bucket = "abc-nft-zurich-test-1";

const client = new S3Client({ region: "us-east-1", endpoint });

app.get("/assets", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  client
    .send(new ListObjectsCommand({ Bucket: bucket }))
    .then((value) => {
      const promises = value.Contents?.filter(
        (nft) => nft.Key && nft.Key.indexOf(".json") > 0
      ).map((nft) =>
        Promise.all([
          client
            .send(
              new HeadObjectCommand({
                Bucket: bucket,
                Key: nft.Key?.replace(".json", ".png"),
              })
            )
            .then((value) => value?.Metadata?.cid),
          client
            .send(
              new HeadObjectCommand({
                Bucket: bucket,
                Key: nft.Key,
              })
            )
            .then((value) => value?.Metadata?.cid),
          client
            .send(
              new GetObjectCommand({
                Bucket: bucket,
                Key: nft.Key,
              })
            )
            .then((value) => value?.Body?.transformToString()),
        ]).then(([imageCid, metadataCid, metadata]) => ({
          imageCid,
          metadataCid,
          metadata: JSON.parse(metadata || ""),
        }))
      );
      if (!promises) return;
      return Promise.all(promises);
    })
    .then((cids) => {
      console.log(cids);
      res.send(cids);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
