// app/api/dashboard/surplus-by-category/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ingredientsWithCategories = await prisma.ingredient.findMany({
      select: {
        id: true,
        weight: true,
        category: true,
      },
    });

    const surplusByCategory = ingredientsWithCategories.reduce(
      (acc, ingredient) => {
        const categoryName = ingredient.category.name;
        const categoryId = ingredient.category.id;

        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            categoryName,
            totalWeight: 0,
            itemCount: 0,
          };
        }

        acc[categoryId].totalWeight += ingredient.weight;
        acc[categoryId].itemCount += 1;

        return acc;
      },
      {} as Record<
        string,
        {
          categoryId: string;
          categoryName: string;
          totalWeight: number;
          itemCount: number;
        }
      >
    );

    // Convert to array and sort by total weight (descending)
    const result = Object.values(surplusByCategory)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .map((item) => ({
        ...item,
        totalWeight: Math.round(item.totalWeight * 100) / 100, // Round to 2 decimal places
      }));

    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        totalCategories: result.length,
        totalWeight: result.reduce((sum, item) => sum + item.totalWeight, 0),
        totalItems: result.reduce((sum, item) => sum + item.itemCount, 0),
      },
    });
  } catch (error) {
    console.error("Error fetching surplus by category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
