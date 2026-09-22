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
  page: number;
  limit: number;
}

type updateLeadData = Partial<CreateLeadData>;

export const createLead = async (data: CreateLeadData) => {
  return prisma.lead.create({
    data,
  });
};

export const getLeads = async ({
  search,
  status,
  page,
  limit,
}: GetLeadsParams) => {
  const where = {
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
  };

  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.lead.count({
      where,
    }),
  ]);

  return {
    leads,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getLeadById = async (id: number) => {
  return prisma.lead.findUnique({
    where: {
      id,
    },
  });
};

export const updateLead = async (id: number, data: updateLeadData) => {
  return prisma.lead.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteLead = async (id: number) => {
  return prisma.lead.delete({
    where: {
      id,
    },
  });
};
