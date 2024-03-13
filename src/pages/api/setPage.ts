import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '10mb'
      }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string } | null>) {
  if (req.method !== "POST") return res.status(405).json(null);
  if(req.body.key !== api.key) return res.status(401).json(null);
  if (!req.body.id) return res.status(404).json(null);
  let id: number = +req.body.id;
  if (isNaN(id)) return res.status(400).json(null);
  try {
    await prisma.pages.update({
      where: {
        id: id,
      },
      data: {
        content: req.body.content,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
  res.status(200).json({ message: "ok" });
}
