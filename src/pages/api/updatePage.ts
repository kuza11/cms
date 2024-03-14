import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string } | null>) {
  if (req.method !== "POST") return res.status(405).json(null);
  if (req.body.key !== api.key) return res.status(401).json(null);
  if (!req.body.id) return res.status(404).json(null);
  let id: number = +req.body.id;
  if (isNaN(id)) return res.status(400).json(null);
  let hidden: boolean | null;
  let name: string | null;
  if (req.body.hidden != null) {
    if (typeof req.body.hidden !== "boolean") return res.status(400).json(null);
    hidden = req.body.hidden;
  } else {
    hidden = null;
  }
  if (req.body.name) {
    if (typeof req.body.name !== "string") return res.status(400).json(null);
    name = req.body.name;
  } else {
    name = null;
  }
  try {
    if (hidden != null) {
      await prisma.pages.update({
        where: {
          id: id,
        },
        data: {
          hidden: hidden,
        },
      });
    }
    if (name != null) {
      await prisma.pages.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
  res.status(200).json({ message: "ok" });
}
