import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string } | null>) {
  if (req.method !== "POST") {
    prisma.$disconnect();
    return res.status(405).json(null);
  }
  if (req.body.key !== api.key) {
    prisma.$disconnect();
    return res.status(401).json(null);
  }
  if (!req.body.id) {
    prisma.$disconnect();
    return res.status(404).json(null);
  }
  let id: number = +req.body.id;
  if (isNaN(id)) {
    prisma.$disconnect();
    return res.status(400).json(null);
  }
  let hidden: boolean | null;
  let name: string | null;
  let num: number | null;
  if (req.body.hidden != null) {
    if (typeof req.body.hidden !== "boolean") {
      prisma.$disconnect();
      return res.status(400).json(null);
    }
    hidden = req.body.hidden;
  } else {
    hidden = null;
  }
  if (req.body.name) {
    if (typeof req.body.name !== "string") {
      prisma.$disconnect();
      return res.status(400).json(null);
    }
    name = req.body.name;
  } else {
    name = null;
  }
  if (req.body.num) {
    if (typeof req.body.num !== "number") {
      prisma.$disconnect();
      return res.status(400).json(null);
    }
    num = req.body.num;
  } else {
    num = null;
  }
  try {
    if (hidden != null && num != null) {
      await prisma.pages.updateMany({
        where: {
          pageNum: num,
        },
        data: {
          hidden: true,
        },
      });
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
    prisma.$disconnect();
    return res.status(500).json({ message: "error" });
  }
  res.status(200).json({ message: "ok" });
  prisma.$disconnect();
}
