import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";

export interface NamesData extends Array<{ name: string, id: number, pageNum: number }> {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NamesData | null>,
) {
  const getNames: NamesData | null = await prisma.pages.findMany({
    select: {
      name: true,
      id: true,
      pageNum: true
    },
  });
  res.status(200).json(getNames);
}