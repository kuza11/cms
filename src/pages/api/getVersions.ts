import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export interface PageData extends Object {
  id: number,
  pageNum: number,
  pageVersion: number,
  name: string,
  content: string | null,
  date: Date
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PageData | null>,
) {
  if (req.method !== "POST") return res.status(405).json(null);
  if(req.body.key !== api.key) return res.status(401).json(null);
  if(!req.query.num) return res.status(404).json(null);
  let num: number = +req.query.num
  if(isNaN(num)) return res.status(404).json(null);
  const getUser: PageData | null = await prisma.pages.findFirst({
    where: {
      pageNum: num,
    },
    select: {
      id: true,
      pageNum: true,
      pageVersion: true,
      name: true,
      content: true,
      date: true,
    },
    orderBy: {
      pageVersion: "desc",
    }
  })
  res.status(200).json(getUser);
}
