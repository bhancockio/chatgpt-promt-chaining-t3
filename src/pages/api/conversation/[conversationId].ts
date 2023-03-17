import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { conversationId } = req.query;

  console.log(conversationId);
  // Fetch data for conversation with given id
  // ...

  res.status(200).json({ message: conversationId });
}
