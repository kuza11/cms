import type { NextApiRequest, NextApiResponse } from "next";
import api from "../../../api.json";
import { compare } from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string } | null>) {
  if (req.method !== "POST") return res.status(405).json(null);
  if (req.body.key !== api.key) return res.status(401).json(null);

  if (req.body.password == null || req.body.password == "") return res.status(400).json(null);
  compare(req.body.password, api.password).then((result) => {
    if (result) {
      res.status(200).json({ message: "ok" });
    } else {
      res.status(401).json({ message: "wrong password" });
    }
  });
}
