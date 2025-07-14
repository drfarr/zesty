// app/api/ingredients/route.ts - Main API endpoint
import { PaginatedResponse } from "@/types/api";
import { User } from "@/types/db";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 0;

    const [data, totalCount] = await Promise.all([prisma.user.findMany({}), prisma.user.count({})]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const response: PaginatedResponse<User> = {
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext,
        hasPrev,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching ingredients:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch ingredients",
        details: process.env.NODE_ENV === "development" ? "Failed to fetch ingredients" : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
