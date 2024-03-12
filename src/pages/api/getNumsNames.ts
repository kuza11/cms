import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";

export interface NumsNamesData extends Array<{ pageNum: number, name: string }> {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NumsNamesData | null>,
) {
  const getNames: NumsNamesData | null = await prisma.pages.findMany({
    distinct: ["pageNum"],
    select: {
      pageNum: true,
      name: true
    },
  });
  res.status(200).json(getNames);
}