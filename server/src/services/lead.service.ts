import { email } from "zod";
import { prisma } from "../lib/prisma.js";

interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
  status?: "new" | "contacted" | "qualified" | "lost";
}

interface GetLeadsParams {
  search?: string;
  status?: "new" | "contacted" | "qualified" | "lost";
}

export const createLead = async (data: CreateLeadData) => {
  return prisma.lead.create({
    data,
  });
};

export const getLeads = async (params: GetLeadsParams) => {
  const { search, status } = params;

  return prisma.lead.findMany({
    where: {
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      }),

      ...(status && {
        status,
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getLeadById = async (id: number) => {
  return prisma.lead.findUnique({
    where: {
      id,
    },
  });
};
