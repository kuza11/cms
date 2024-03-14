import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string } | null>) {
  if (req.method !== "POST") return res.status(405).json(null);
  if (req.body.key !== api.key) return res.status(401).json(null);
  let id: number | null = null;
  let num: number | null = null;
  if (req.body.num) {
    num = +req.body.num;
    if (isNaN(num)) return res.status(400).json(null);
  }
  if (req.body.id) {
    id = +req.body.id;
    if (isNaN(id)) return res.status(400).json(null);
  }
  if (id) {

    try {
        console.log(id);
      prisma.pages.delete({
        where: {
          id: 58,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
    res.status(200).json({ message: "ok" });
  }
  if (num) {
    try {
      prisma.pages.deleteMany({
        where: {
          pageNum: num,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
    res.status(200).json({ message: "ok" });
  }
}
