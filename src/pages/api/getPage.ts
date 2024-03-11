// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
export interface PageData extends Object {
  id: number,
  pageNum: number,
  name: string,
  content: string,
  date: Date
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PageData | null>,
) {
  if(!req.query.id) return res.status(404).json(null);
  let id: number = +req.query.id
  if(isNaN(id)) return res.status(404).json(null);
  const getUser: PageData | null = await prisma.pages.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      pageNum: true,
      name: true,
      content: true,
      date: true,
    },
  })
  res.status(200).json(getUser);
}
