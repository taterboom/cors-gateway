// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
// import fs from "node:fs/promises"
import getRawBody from "raw-body"
import { cors, runMiddleware } from "../../utils/runMiddleware"
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  if (req.method !== "POST") {
    res.status(405).json({ error: "only POST method is allowed" })
    return
  }

  const rawBody = await getRawBody(req)
  //   fs.writeFile("req.png", rawBody)
  //   console.log(req.headers.Authorization, req.headers.authorization)

  //   const form = new formidable.IncomingForm()
  //   form.parse(req, async function (err, fields, files) {
  //     console.log(err, fields, files)
  //     fs.writeFile("req.png", files.file)
  //     return res.status(201).send("")
  //   })

  //   console.log(typeof req.body, req.body)
  //   fs.writeFile("req.png", req.body)
  //   res.json({ body: "req.body" })

  const data = await fetch("https://api.tinify.com/shrink", {
    method: "POST",
    headers: {
      Authorization: req.headers.Authorization || (req.headers.authorization as any),
    },
    body: rawBody,
  }).then((res) => res.json())
  const image = await fetch(data.output.url).then((res) => res.arrayBuffer())
  res.setHeader("Content-Type", "image/png")
  return res.send(Buffer.from(image))

  //   const { key, message } = req.body
  //   res.json({ data: await cryptoSign(key, message) })
}
